# Audio MOS Evaluator

BBQ T2A Voice Quality MOS evaluation interface and API scaffold.

## Current status
The frontend collects the required inputs and the API validates them. **The actual audio evaluation engine is not connected yet.** The API intentionally returns HTTP 501 after successful input validation and never fabricates scores.

## Required inputs
- Audio recording.
- Exact reference text.
- Scenario / Domain selected from the guideline categories.
- For Video Voice-Over: select the applicable content type (News, Entertainment / Social Media, Character Animation, or Religious / Formal Content).
- For Other: Additional Notes describing the intended scenario when none of the listed domains fits.

## Evaluation requirements
The eventual engine must follow the supplied BBQ T2A Voice Quality MOS Evaluation Guidelines:
- Score TTS Basic Overall MOS and Scene Style Fit MOS independently.
- Use only evidence from the full audio, reference text, and selected scenario/domain.
- Apply the issue tags defined by the guideline.
- If the scenario does not fit, recommend a more suitable domain and explain the mismatch.
- Never fabricate words, timestamps, findings, or MOS scores.

## Local development
Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

Open `frontend/index.html` in a browser for the static interface. Set `API_BASE` in `frontend/app.js` to the deployed backend URL when the evaluation engine is implemented and deployed.
