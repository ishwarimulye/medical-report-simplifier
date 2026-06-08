from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pdf_parser import extract_text_from_pdf
from gemini import analyze_medical_report

# Create the FastAPI application
app=FastAPI(title="Medical Report Simplifier API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    """Simple endpoint to confirm API is running"""
    return {"status": "Medical Report Simplifier API is running"}

@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    """
    Main endpoint.
    Accepts a PDF file upload.
    Returns structured medical analysis as JSON.
    """
    #check file is a pdf
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted."
        )
    # Read file into memory as bytes
    file_bytes = await file.read()

    # Check file size — max 10MB
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum 10MB allowed."
        )
    #Step 1 : extract text from pdf
    report_text=extract_text_from_pdf(file_bytes)

    if report_text.startswith("ERROR:"):
        raise HTTPException(status_code=400, detail=report_text)

    # Step 2 : Send text to Gemini for analysis
    analysis = analyze_medical_report(report_text)

    if analysis is None or "error" in analysis:
        error_msg = analysis.get("error", "Unknown error") if analysis else "Analysis returned no result"
        raise HTTPException(status_code=500, detail=error_msg)

    # Step 3 : Return analysis to frontend
    return analysis