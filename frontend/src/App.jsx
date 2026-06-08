import { useState } from "react"
import axios from "axios"
import "./App.css"

export default function App(){
  const [file,setFile]=useState(null) //selected pdf file
  const [loading,setLoading]=useState(false) //show spinner
  const [result, setResult]=useState(null)  // API response
  const [error, setError]=useState(null)   // error message

  //Called when user selects a file
  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid PDF file.")
    }
  }
  // Called when user clicks Analyze
  async function handleAnalyze() {
    if (!file) return

    setLoading(true)
    setResult(null)
    setError(null)
    // FormData to send files to the backend
    const formData = new FormData()
    formData.append("file", file)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }
  //reset
  function handleReset() {
    setFile(null)
    setResult(null)
    setError(null)
  }
  //helper
  function getStatusClass(status) {
    if (status === "Normal") return "status-badge status-normal"
    if (status === "Abnormal") return "status-badge status-abnormal"
    return "status-badge status-borderline"
  }

  return (
    <div className="app">
    {/* Header */}
      <header className="header">
        <div>
          <h1>Medical Report Simplifier</h1>
          <p>Upload your lab report and get a plain language explanation</p>
        </div>
      </header>
      <main className="main">

        {/* Upload Section — show only when no result yet */}
        {!result && (
          <div className="upload-card">
            <div className="upload-icon">📄</div>
            <h2>Upload Your Medical Report</h2>
            <p>
              Supports digitally generated PDF reports.
              Scanned reports are not supported.
            </p>
            <label className="file-input-label">
              Choose PDF File
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
            {/* Show selected file name */}
            {file && (
              <div className="file-selected">
                 {file.name}
              </div>
            )}
            {/* Show error if any */}
            {error && (
              <div style={{ color: "#c53030", marginTop: "12px", fontSize: "0.9rem" }}>
                ⚠️ {error}
              </div>
            )}
            {/* Analyze button */}
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!file || loading}
            >
              {loading ? "Analyzing..." : "Analyze Report"}
            </button>
          </div>
        )}
        {/* Loading Spinner */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your report with AI...</p>
            <p style={{ fontSize: "0.85rem", color: "#a0aec0", marginTop: "8px" }}>
              This may take 10-15 seconds
            </p>
          </div>
        )}
        {/* Results Section */}
        {result && (
          <div className="results">
            {/* Patient Info */}
            <div className="result-card">
              <h3> Patient Information</h3>
              <div className="patient-grid">
                <div className="patient-item">
                  <div className="label">Name</div>
                  <div className="value">{result.patient_info?.name || "Unknown"}</div>
                </div>
                <div className="patient-item">
                  <div className="label">Age</div>
                  <div className="value">{result.patient_info?.age || "Unknown"}</div>
                </div>
                <div className="patient-item">
                  <div className="label">Gender</div>
                  <div className="value">{result.patient_info?.gender || "Unknown"}</div>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="result-card">
              <h3>Summary</h3>
              <p className="summary-text">{result.summary}</p>
            </div>
            {/* Parameters */}
            <div className="result-card">
              <h3>
                🔬 Test Parameters
                {result.abnormal_count > 0 && (
                  <span className="abnormal-badge">
                    {result.abnormal_count} Abnormal
                  </span>
                )}
                </h3>
              <table className="parameters-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Your Value</th>
                    <th>Normal Range</th>
                    <th>Status</th>
                    <th>What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {result.parameters?.map((param, index) => (
                    <tr key={index}>
                      <td><strong>{param.name}</strong></td>
                      <td>{param.value}</td>
                      <td>{param.normal_range}</td>
                      <td>
                        <span className={getStatusClass(param.status)}>
                          {param.status}
                        </span>
                      </td>
                      <td>{param.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Questions for Doctor */}
            <div className="result-card">
              <h3> Questions to Ask Your Doctor</h3>
              <ul className="questions-list">
                {result.questions_for_doctor?.map((q, index) => (
                  <li key={index}>
                    <span className="question-num">{index + 1}.</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="disclaimer">
              ⚠️ {result.disclaimer}
            </div>

            {/* Analyze Another Report */}
            <button className="reset-btn" onClick={handleReset}>
              ← Analyze Another Report
            </button>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        Medical Report Simplifier — For educational purposes only
      </footer>

    </div>
  )
}



