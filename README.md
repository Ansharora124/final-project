# PixelPrize photo judging

The working photo collection is at **http://localhost:3000/judge/photos**, linked as **Photo Judging** in the judge sidebar. The surrounding competition, account and historical-result pages still use the project's demonstration data; they are not a production account or competition backend.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`. Set `GEMINI_API_KEY` to your own API key. Never put it in a `NEXT_PUBLIC_` variable or commit it.
3. Run `npm run dev -- --hostname 127.0.0.1` and open the URL above.
4. Add photographs now or later. Click **Evaluate photos** when ready. Without an API key, uploads, browsing, persistence and exports remain available; automatic judging is disabled with a setup message.

With GEMINI_API_KEY configured, the default model is gemini-3.8-flash; GEMINI_JUDGING_MODEL selects another accessible Gemini vision model. The legacy gemenie_API_KEY spelling is also accepted. OpenAI remains a fallback when only OPENAI_API_KEY is set. Restart after configuration changes. Do not change the model or rubric halfway through a collection: the application prevents mixing saved results from different settings.

## Implemented workflow

- One local collection of up to 200 JPEG, PNG or WebP photos; 20 MB and 40 megapixels per photograph. Identical files are detected by SHA-256. Invalid and animated files cannot reach scoring. Lossless normalized images above 20 MB require a smaller copy.
- Sequential evaluations, individual retry, progress and pause after the current photo. Keep the page open; this is not a background job service. Results are saved after each photo, so refreshing resumes from saved progress. An interrupted request can still incur provider usage; retry may incur another charge.
- Original uploads and results persist in IndexedDB on this browser and origin. Browser data deletion removes them. They do not sync across devices. Web Locks prevent concurrent writes from multiple tabs. JSON/CSV export includes results and file identifiers, not image files; keep original photos separately.
- Fixed composition / lighting / technical / creativity / impact maxima of **25 / 20 / 20 / 20 / 15**. Whole-number scores, exact total validation, specific strengths, weaknesses and one improvement. Each evaluation JSON contains only the ten requested fields.
- Images are decoded, oriented and normalized losslessly to sRGB PNG; EXIF/identity metadata is removed. No filename, caption, other photograph, past score or ranking is sent to the model. Each call is independent and uses the same rubric, configured model and temperature. The vision service may internally resize inputs; fine-detail measurements are not guaranteed.
- Low-confidence, unassessable photos have **null in all six numeric fields**, never a fabricated zero, and explain the limitation in `shortJudgement`. They are excluded from rankings/statistics. Provider errors remain retryable failed entries without evaluations.
- Rankings use raw totals and competition ranking for ties (1, 1, 3). Mean, median and population standard deviation exclude unscored/failed entries. Saved scores are not curved or automatically rescored. Ranking is provisional while entries remain unevaluated. A fixed process reduces drift but does not make subjective AI judgments perfectly deterministic or objective.
- Individual JSON downloads contain only the requested evaluation. Collection JSON wraps evaluation objects with entry IDs, filenames, timestamps, status, model, rubric and rank for auditing. CSV protects against formula injection and preserves blank missing scores.

The older manual judge form now starts without invented scores or prefilled feedback, and the shared competition rubric matches the requested weights. Its surrounding historical reviews remain demonstration data. Use Photo Judging for actual uploads and persisted AI results.

## Checks

`npm test` covers rubric validation, invalid totals/ranges, unscored versus zero, ties across 200 entries, statistics, CSV escaping, image validation and EXIF removal, stateless provider requests, refusal/error handling and API configuration/origin checks. Provider responses are mocked: these tests do not spend API credits or establish real judging quality.

`npm run typecheck` checks TypeScript. `npm run build` verifies the application build.

Automatic judging is restricted to localhost with same-origin checks because this project's existing login is a demonstration. Bind the server to loopback. A public deployment needs real authentication, authorization, distributed rate limits/queues and persistent server storage before exposing a paid evaluation endpoint.

The dependency audit also reports two high-severity dependency groups in the existing Next.js 14 stack (Next.js and its bundled PostCSS). Resolving those requires a framework upgrade; this implementation does not migrate the surrounding application. Keep this version local until that upgrade and the production requirements above are addressed.

Implementation references: [OpenAI image inputs](https://developers.openai.com/api/docs/guides/images-vision), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), and [GPT-4o snapshots](https://developers.openai.com/api/docs/models/gpt-4o).
