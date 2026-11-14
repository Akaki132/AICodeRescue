# AIcoderescue

Paste or drop a lab screenshot. Get a direct, peer-style fix.

## Run

1. Copy `.env.example` to `.env` and add an `OPENAI_API_KEY`.
2. `npm install`
3. `npm run dev`
4. Open the Vite URL (usually `http://localhost:5173`).

Without a key, analysis still runs in **demo mode** so the paste → loading → split-view loop is testable. Payment is mocked: three free rescues, then “Unlock with mock card.”
