import { NextRequest, NextResponse } from 'next/server';
import { EvaluationError, evaluateImage, prepareImage } from '@/lib/judging/evaluator';
import { MAX_IMAGE_BYTES, RUBRIC_VERSION } from '@/lib/judging/rubric';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 150;
const model = () => process.env.OPENAI_JUDGING_MODEL || 'gpt-4o-2024-08-06';
let evaluating = false;

export function GET() {
  return NextResponse.json({ configured: Boolean(process.env.OPENAI_API_KEY), model: model(), rubricVersion: RUBRIC_VERSION }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  // This workspace is local-only until the surrounding demo has real authentication.
  if (!['localhost', '127.0.0.1', '[::1]'].includes(request.nextUrl.hostname)) return NextResponse.json({ error: 'Automatic judging is available on localhost only.' }, { status: 403 });
  if (request.headers.get('origin') !== request.nextUrl.origin || request.headers.get('x-judging-client') !== 'photo-workspace') return NextResponse.json({ error: 'Use the photo judging workspace to submit photographs.' }, { status: 403 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Automatic judging needs OPENAI_API_KEY in .env.local. Add the key on the server and restart the app.' }, { status: 503 });
  if (evaluating) return NextResponse.json({ error: 'Another photograph is being evaluated. Wait for it to finish before retrying.' }, { status: 429 });
  evaluating = true;
  try {
    const contentLength = Number(request.headers.get('content-length'));
    if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > MAX_IMAGE_BYTES + 16384) throw new EvaluationError('Upload one photograph of up to 20 MB.', 413);
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) throw new EvaluationError('Upload a photograph using the workspace.', 400);
    const form = await request.formData();
    const photo = form.get('photo');
    if (!photo || typeof photo === 'string' || !('arrayBuffer' in photo)) throw new EvaluationError('A photograph is required.', 400);
    if (form.get('model') !== model() || form.get('rubricVersion') !== RUBRIC_VERSION) throw new EvaluationError('Judging settings have changed. Keep the same model and rubric for every entry in this collection.', 409);
    const image = await prepareImage(Buffer.from(await photo.arrayBuffer()), photo.type);
    const evaluation = await evaluateImage(image, process.env.OPENAI_API_KEY, model());
    // Keep the evaluation body limited to the user's ten requested fields.
    return NextResponse.json(evaluation, { headers: { 'Cache-Control': 'no-store', 'X-Judging-Model': model(), 'X-Judging-Rubric': RUBRIC_VERSION } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof EvaluationError ? error.message : 'Could not process the photograph. Please retry.' }, { status: error instanceof EvaluationError ? error.status : 500 });
  } finally { evaluating = false; }
}
