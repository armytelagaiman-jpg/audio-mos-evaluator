# Audio MOS Evaluator

Public-facing interface scaffold for BBQ T2A Voice Quality MOS evaluation.

## Current status
This repository currently contains the user interface and a backend API scaffold. **The evaluation engine is not connected yet**, so the app must not invent findings or MOS scores.

## Interface
- Upload an audio recording.
- Upload or paste reference text.
- Optionally provide the target scene/scenario.
- View detected issue categories and the two independent MOS scores.

## Local development
Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

Open `frontend/index.html` in a browser for the static interface. Set `API_BASE` in `frontend/app.js` to the deployed backend URL when ready.

## Required next milestone
Connect and validate a real audio evaluation engine: transcription/alignment, evidence-based detection of BBQ issue categories, and separately calibrated Basic MOS and Scene Style Fit MOS. Do not enable scoring until this has been implemented and tested against the supplied BBQ rubric.
