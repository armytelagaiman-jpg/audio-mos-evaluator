from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Audio MOS Evaluator API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to the deployed frontend origin before production.
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

ALLOWED_SCENARIOS = {
    "AI Assistant",
    "Spoken-Language Teaching",
    "Navigation Prompt",
    "Podcast / Vlog",
    "Digital-Human Live Commerce",
    "Customer Service",
    "Audiobook",
    "Video Voice-Over",
    "Other",
}
ALLOWED_VOICE_OVER_TYPES = {
    "News",
    "Entertainment / Social Media",
    "Character Animation",
    "Religious / Formal Content",
}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "evaluation_engine": "not_configured",
        "api_version": "0.2.0",
    }

@app.post("/evaluate")
async def evaluate(
    audio: UploadFile = File(...),
    reference_text: str = Form(""),
    scenario: str = Form(""),
    scenario_subdomain: str = Form(""),
    additional_notes: str = Form(""),
):
    if not audio.filename:
        raise HTTPException(status_code=400, detail="Audio file is required.")
    if not reference_text.strip():
        raise HTTPException(status_code=400, detail="Reference text is required.")
    if scenario not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Please select a valid Scenario / Domain.")
    if scenario == "Video Voice-Over" and scenario_subdomain not in ALLOWED_VOICE_OVER_TYPES:
        raise HTTPException(status_code=400, detail="Please select a valid Video Voice-Over type.")
    if scenario == "Other" and not additional_notes.strip():
        raise HTTPException(status_code=400, detail="Please describe the intended scenario in Additional Notes.")

    # These fields are now accepted and validated by the API.
    # A real BBQ-compliant audio analysis engine must still be connected and validated here.
    # Do not emit placeholder findings or fabricated MOS values.
    raise HTTPException(
        status_code=501,
        detail="Input validation passed, but the BBQ evaluation engine has not been connected yet. No score was generated."
    )
