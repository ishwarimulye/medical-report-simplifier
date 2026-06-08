from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
# Create client with API key
client=genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
def analyze_medical_report(report_text: str) -> dict:
    """
    Sends report text to Gemini.
    Returns structured analysis as a Python dictionary.
    """
    prompt=f"""
You are a medical report assistant helping patients understannd their lab reports.
Analyze the following medical report and respond ONLY with a valid JSON objecct.
Do not include any text before or after the JSON.

Important instructions:
-Extract patient name,age, and gender from the report if mentioned
-Use gender-appropriate normal ranges where applicable(e.g. Hemoglobin differs for male/female)
-If gender is unknown, mention both ranges like "Male: 13.5-17.5 g/dL, Female: 12.0-15.5 g/dL"

Medical Report:
{report_text}

Respond with exactly this JSON structure:
{{
"patient_info": {{
"name": "patient name or Unknown",
"age": "patient age or Unknown",
"gender":"Male or Female or Unknown"
}},
"summary": "2-3 sentence plain language summary of what this report shows",
"parameters": [
{{
"name": "parameter name e.g. Hemoglobin",
"value": "patient value with unit e.g. 11.2 g/dL",
"normal_range": "gender-appropriate range, or both ranges if gender unknown",
"status": "Normal or Abnormal or Borderline",
"explanation": "one sentence plain language explanation"
}}
],
"abnormal_count": 0,
"questions_for_doctor": [
"question 1",
"question 2",
"question 3",
],
"disclaimer": "This is AI-generated for educational purposes only. Always consult your doctor."
}}
"""
    try:
        print("Calling Gemini API...")  # debug log
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        print("Gemini response received")  # debug log
        print("Raw response:", response.text[:200])  # show first 200 chars
        
        response_text = response.text.strip()
        # Remove markdown code blocks if present
        if "```" in response_text:
            parts = response_text.split("```")
            response_text = parts[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]

        result = json.loads(response_text)
        print("JSON parsed successfully")  # debug log
        return result

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Response was: {response.text}")
        return {"error": f"Could not parse Gemini response: {str(e)}"}
    
    except Exception as e:
        print(f"Gemini API error: {e}")
        return {"error": f"Analysis failed: {str(e)}"}
