# Medical Report Simplifier

An AI-powered full-stack web application that simplifies medical lab reports into plain language that anyone can understand.

##  Live Demo
- Frontend: https://medical-report-simplifier-eta.vercel.app
- Backend API: https://medical-report-simplifier-api.onrender.com

##  Tech Stack

**Frontend:** React, Vite, Axios  
**Backend:** Python, FastAPI, PyMuPDF  
**AI:** Google Gemini API  
**Deployment:** Vercel (frontend) + Render (backend)

##  Features
- Upload any digitally generated PDF medical report
- AI extracts and explains all test parameters in plain language
- Gender-aware normal ranges
- Highlights abnormal values with color coding
- Generates questions to ask your doctor
- Responsible AI disclaimer

##  Project Structure
medical-report-simplifier/
├── backend/
│   ├── main.py         ← FastAPI REST API
│   ├── gemini.py       ← Gemini AI integration
│   ├── pdf_parser.py   ← PDF text extraction
│   └── requirements.txt
└── frontend/
└── src/
└── App.jsx     ← React UI

##  Run Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Add GEMINI_API_KEY to .env file
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

##  Limitations
- Supports digitally generated PDFs only
- Scanned or image-based reports not supported
- For educational purposes only — not a substitute for medical advice
