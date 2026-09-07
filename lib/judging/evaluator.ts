import sharp from 'sharp';
import { EVALUATION_SCHEMA, IMAGE_TYPES, JUDGING_PROMPT, MAX_IMAGE_BYTES, validateEvaluation } from './rubric';

export class EvaluationError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export async function prepareImage(bytes: Buffer, mimeType: string) {
  if (!IMAGE_TYPES.includes(mimeType)) throw new EvaluationError('Use a JPEG, PNG or WebP photograph.', 415);
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new EvaluationError('Each photograph must be between 1 byte and 20 MB.', 413);
  try {
    const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: 'warning' });
    const metadata = await image.metadata();
    const expected = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' }[mimeType];
    if (metadata.format !== expected || (metadata.pages ?? 1) > 1) throw new Error('Invalid or animated image');
    // Apply EXIF orientation, strip identifying metadata, preserve resolution and avoid lossy recompression.
    const normalized = await image.rotate().toColourspace('srgb').png().toBuffer();
    if (normalized.length > MAX_IMAGE_BYTES) throw new EvaluationError('The decoded photo is too large. Upload a smaller-resolution copy.', 413);
    return `data:image/png;base64,${normalized.toString('base64')}`;
  } catch (error) {
    if (error instanceof EvaluationError) throw error;
    throw new EvaluationError('The file could not be decoded as a still photograph (maximum 40 megapixels).', 422);
  }
}

export async function evaluateImage(imageUrl: string, apiKey: string, model: string, fetcher: typeof fetch = fetch) {
  let response: Response;
  try {
    response = await fetcher('https://api.openai.com/v1/responses', {
      method: 'POST', signal: AbortSignal.timeout(120_000),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, store: false, temperature: 0,
        instructions: JUDGING_PROMPT,
        input: [{ role: 'user', content: [{ type: 'input_text', text: 'Evaluate this photograph independently using the fixed rubric.' }, { type: 'input_image', image_url: imageUrl, detail: 'high' }] }],
        text: { format: { type: 'json_schema', name: 'photograph_evaluation', strict: true, schema: EVALUATION_SCHEMA } },
        max_output_tokens: 2200,
      }),
    });
  } catch {
    throw new EvaluationError('The evaluation connection failed or timed out. This photograph has not been scored. Retry when ready.', 504);
  }
  if (!response.ok) {
    if (response.status === 429) throw new EvaluationError('The AI service reached its rate or credit limit. Check usage before retrying.', 429);
    if (response.status === 401 || response.status === 403) throw new EvaluationError('The AI service rejected the API credentials. Check the server API key and model access.', 503);
    if (response.status === 400 || response.status === 404) throw new EvaluationError('The AI model configuration was rejected. Check that the configured model supports image input, structured outputs and temperature=0.', 503);
    throw new EvaluationError('The AI service could not complete the evaluation. Check model configuration and retry.');
  }
  try {
    const body = await response.json();
    if (body.status !== 'completed') throw new Error('Incomplete response');
    const content = (body.output ?? []).filter((item: { type: string }) => item.type === 'message').flatMap((item: { content: unknown[] }) => item.content ?? []);
    if (content.some((item: { type: string }) => item.type === 'refusal')) throw new EvaluationError('The AI service declined to evaluate this photograph. No score was assigned.', 422);
    const text = content.filter((item: { type: string }) => item.type === 'output_text').map((item: { text: string }) => item.text).join('');
    return validateEvaluation(JSON.parse(text));
  } catch (error) {
    if (error instanceof EvaluationError) throw error;
    throw new EvaluationError('The AI response failed score validation. No result was saved. Retry this photograph.');
  }
}
