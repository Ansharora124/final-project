import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { NextRequest } from 'next/server';
import { CRITERIA, EVALUATION_KEYS, JUDGING_PROMPT, RUBRIC_VERSION, validateEvaluation } from '../lib/judging/rubric';
import { rankEntries, resultsCsv, scoreStatistics, JudgingEntry } from '../lib/judging/results';
import { evaluateImage, prepareImage } from '../lib/judging/evaluator';
import { GET, POST } from '../app/api/judging/route';

const valid = {
  compositionScore: 20, lightingScore: 16, technicalScore: 16, creativityScore: 15, impactScore: 12, finalScore: 79,
  strengths: ['The diagonal foreground leads the eye toward the subject.'],
  weaknesses: ['A bright edge competes with the main subject.'],
  improvementSuggestion: 'Crop the bright strip along the right edge.',
  shortJudgement: 'Strong visual flow, with a distracting edge limiting the impact.',
};
const unscored = { ...valid, ...Object.fromEntries([...CRITERIA.map(c => c.key), 'finalScore'].map(key => [key, null])), strengths: [], weaknesses: [], shortJudgement: 'Low confidence: the subject cannot be assessed at this resolution.', improvementSuggestion: 'Upload a higher-resolution photograph.' };
const entry = (id: string, finalScore = 79): JudgingEntry => ({ id, fileName: `${id}.jpg`, addedAt: '2026-09-07', status: 'completed', evaluation: { ...valid, finalScore }, model: 'test-model', rubricVersion: RUBRIC_VERSION });

test('rubric totals 100 and evaluations contain exactly ten requested fields', () => {
  assert.equal(CRITERIA.reduce((sum, c) => sum + c.max, 0), 100);
  assert.equal(EVALUATION_KEYS.length, 10);
  assert.deepEqual(validateEvaluation(valid), valid);
  assert.match(JUDGING_PROMPT, /intentional blur/i);
});

test('rejects invalid totals, out-of-range scores, partial scores, NaN, fractions, missing and extra fields', () => {
  for (const changes of [{ finalScore: 80 }, { compositionScore: 26 }, { lightingScore: -1 }, { creativityScore: 15.5 }, { technicalScore: NaN }, { impactScore: null }, { finalScore: '79' }, { photographer: 'Someone' }]) {
    assert.throws(() => validateEvaluation({ ...valid, ...changes }));
  }
  const missing = { ...valid } as Record<string, unknown>; delete missing.strengths;
  assert.throws(() => validateEvaluation(missing));
  assert.throws(() => validateEvaluation({ ...valid, strengths: [] }));
  assert.throws(() => validateEvaluation({ ...valid, shortJudgement: '' }));
});

test('zero is a real score; null means low confidence and is excluded', () => {
  const zero = { ...valid, ...Object.fromEntries([...CRITERIA.map(c => c.key), 'finalScore'].map(key => [key, 0])) };
  assert.equal(validateEvaluation(zero).finalScore, 0);
  assert.equal(validateEvaluation(unscored).finalScore, null);
  assert.throws(() => validateEvaluation({ ...unscored, shortJudgement: 'Looks good.' }));
  const entries: JudgingEntry[] = [{ ...entry('zero', 0), evaluation: validateEvaluation(zero) }, { ...entry('unknown'), status: 'unscored', evaluation: validateEvaluation(unscored) }, { ...entry('failed'), status: 'failed', evaluation: undefined }];
  assert.equal(rankEntries(entries).length, 1);
  assert.equal(scoreStatistics(entries).mean, 0);
  assert.equal(scoreStatistics([]).mean, null);
});

test('200-photo rankings preserve ties and compute population statistics without modifying scores', () => {
  const entries = Array.from({ length: 200 }, (_, index) => entry(String(index).padStart(3, '0'), index < 2 ? 90 : 70));
  const snapshot = JSON.stringify(entries);
  const ranked = rankEntries(entries);
  assert.equal(ranked.length, 200);
  assert.deepEqual(ranked.slice(0, 3).map(e => e.rank), [1, 1, 3]);
  assert.equal(scoreStatistics(entries).mean, 70.2);
  assert.equal(scoreStatistics(entries).median, 70);
  assert.equal(JSON.stringify(entries), snapshot);
});

test('CSV escapes quotes, newlines and formulas, with blank unscored cells', () => {
  const csv = resultsCsv([{ ...entry('test'), fileName: '=SUM(1,2).jpg', evaluation: { ...valid, strengths: ['A "quote"\nand newline.'] } }, { ...entry('missing'), status: 'pending', evaluation: undefined }]);
  assert.match(csv, /"'=SUM\(1,2\).jpg"/);
  assert.match(csv, /A ""quote""\nand newline/);
  assert.match(csv, /"missing","missing.jpg","pending","",""/);
});

test('image preparation rejects invalid data and strips EXIF without changing pixel dimensions', async () => {
  const original = await sharp({ create: { width: 80, height: 60, channels: 3, background: '#446688' } }).withExif({ IFD0: { Artist: 'Hidden Author' } }).jpeg().toBuffer();
  const data = await prepareImage(original, 'image/jpeg');
  const metadata = await sharp(Buffer.from(data.split(',')[1], 'base64')).metadata();
  assert.equal(metadata.width, 80); assert.equal(metadata.height, 60); assert.equal(metadata.exif, undefined);
  await assert.rejects(() => prepareImage(original, 'image/png'));
  await assert.rejects(() => prepareImage(Buffer.from('not a photo'), 'image/jpeg'));
  await assert.rejects(() => prepareImage(original, 'image/svg+xml'));
  await assert.rejects(() => prepareImage(Buffer.alloc(20 * 1024 * 1024 + 1), 'image/jpeg'));
});

test('provider request is stateless, identity-free, fixed-model and strict structured JSON', async () => {
  const fakeFetch: typeof fetch = async (_url, init) => {
    const body = JSON.parse(init!.body as string);
    assert.equal(body.model, 'test-snapshot'); assert.equal(body.temperature, 0); assert.equal(body.store, false);
    assert.equal(body.input.length, 1); assert.equal(body.input[0].content[1].detail, 'high');
    assert.equal(body.text.format.strict, true); assert.equal(body.previous_response_id, undefined);
    assert.deepEqual(body.text.format.schema.required, EVALUATION_KEYS);
    return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(valid) }] }] });
  };
  assert.deepEqual(await evaluateImage('data:image/png;base64,fixture', 'test-key', 'test-snapshot', fakeFetch), valid);
});

test('provider refusal, malformed totals, incomplete results, rate limits and network failures never produce scores', async () => {
  for (const response of [
    Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }] }),
    Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ ...valid, finalScore: 100 }) }] }] }),
    Response.json({ status: 'incomplete' }), Response.json({}, { status: 429 }), Response.json({}, { status: 401 }), Response.json({}, { status: 400 }),
  ]) await assert.rejects(() => evaluateImage('fixture', 'test-key', 'test-model', async () => response));
  await assert.rejects(() => evaluateImage('fixture', 'test-key', 'test-model', async () => { throw new Error('network'); }));
});

test('Gemini sends the image and strict schema only to Google and validates its response', async () => {
  const fakeFetch: typeof fetch = async (url, init) => {
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');
    assert.equal(new Headers(init!.headers).get('x-goog-api-key'), 'test-key');
    assert.equal(new Headers(init!.headers).has('authorization'), false);
    const body = JSON.parse(init!.body as string);
    assert.equal(body.contents.length, 1);
    assert.deepEqual(body.contents[0].parts[1].inlineData, { mimeType: 'image/png', data: 'fixture' });
    assert.deepEqual(body.generationConfig.responseJsonSchema.required, EVALUATION_KEYS);
    return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ thought: true, text: 'Do not parse reasoning' }, { text: JSON.stringify(valid) }] } }] });
  };
  assert.deepEqual(await evaluateImage('data:image/png;base64,fixture', 'test-key', 'gemini-3.8-flash', fakeFetch), valid);
  for (const body of [
    { promptFeedback: { blockReason: 'SAFETY' } },
    { candidates: [{ finishReason: 'MAX_TOKENS' }] },
    { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ ...valid, finalScore: 100 }) }] } }] },
  ]) await assert.rejects(() => evaluateImage('data:image/png;base64,fixture', 'test-key', 'gemini-3.8-flash', async () => Response.json(body)));
});

test('API reports missing configuration without exposing secrets and rejects outside origins', async () => {
  const key = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = GET(); const config = await response.json();
    assert.equal(config.configured, false); assert.equal(config.rubricVersion, RUBRIC_VERSION);
    assert.equal('apiKey' in config, false);
    const missing = await POST(new NextRequest('http://localhost:3000/api/judging', { method: 'POST', headers: { origin: 'http://localhost:3000', 'x-judging-client': 'photo-workspace' } }));
    assert.equal(missing.status, 503);
    const foreign = await POST(new NextRequest('http://localhost:3000/api/judging', { method: 'POST', headers: { origin: 'https://elsewhere.example' } }));
    assert.equal(foreign.status, 403);
  } finally { if (key !== undefined) process.env.OPENAI_API_KEY = key; }
});

test('API upload decodes a photo and returns only validated fields with model provenance', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.OPENAI_API_KEY = 'test-only-no-network';
  try {
    const config = await GET().json();
    const photo = await sharp({ create: { width: 32, height: 24, channels: 3, background: '#778899' } }).png().toBuffer();
    const form = new FormData();
    form.append('photo', new Blob([new Uint8Array(photo)], { type: 'image/png' }), 'identity-must-not-be-sent.png');
    form.append('model', config.model); form.append('rubricVersion', config.rubricVersion);
    const encoded = new Response(form);
    const bytes = await encoded.arrayBuffer();
    globalThis.fetch = async (_url, options) => {
      assert.doesNotMatch(options!.body as string, /identity-must-not-be-sent/);
      return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(valid) }] }] });
    };
    const request = new NextRequest('http://localhost:3000/api/judging', { method: 'POST', headers: {
      origin: 'http://localhost:3000', 'x-judging-client': 'photo-workspace',
      'content-type': encoded.headers.get('content-type')!, 'content-length': String(bytes.byteLength),
    }, body: bytes });
    const result = await POST(request);
    assert.equal(result.status, 200);
    assert.equal(result.headers.get('x-judging-model'), config.model);
    assert.equal(result.headers.get('x-judging-rubric'), RUBRIC_VERSION);
    assert.deepEqual(await result.json(), valid);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test('Gemini configuration takes priority without exposing the key', () => {
  const previous = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_JUDGING_MODEL;
  process.env.GEMINI_API_KEY = 'test-gemini-secret';
  delete process.env.GEMINI_JUDGING_MODEL;
  try {
    return GET().json().then(config => {
      assert.equal(config.configured, true);
      assert.equal(config.model, 'gemini-3.8-flash');
      assert.doesNotMatch(JSON.stringify(config), /test-gemini-secret/);
    }).finally(() => {
      if (previous === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previous;
      if (previousModel === undefined) delete process.env.GEMINI_JUDGING_MODEL; else process.env.GEMINI_JUDGING_MODEL = previousModel;
    });
  } catch (error) {
    if (previous === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previous;
    if (previousModel === undefined) delete process.env.GEMINI_JUDGING_MODEL; else process.env.GEMINI_JUDGING_MODEL = previousModel;
    throw error;
  }
});
