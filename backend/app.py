from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Audio MOS Evaluator API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to the deployed frontend origin before production.
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "evaluation_engine": "not_configured"}

@app.post("/evaluate")
async def evaluate(
    audio: UploadFile = File(...),
    reference_text: str = Form(""),
    scenario: str = Form(""),
):
    if not audio.filename:
        raise HTTPException(status_code=400, detail="Audio file is required.")
    if not reference_text.strip():
        raise HTTPException(status_code=400, detail="Reference text is required.")
    # A real BBQ-compliant audio analysis engine must be connected and validated here.
    # Do not emit placeholder findings or fabricated MOS values.
    raise HTTPException(
        status_code=501,
        detail="The BBQ evaluation engine has not been connected yet. No score was generated."
    )
