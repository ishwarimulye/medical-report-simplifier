import fitz #PyMuPDF is imported as fitz
def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Takes PDF file as bytes.
    Returns all text content as a single string.
    """
    #Open the PDF directly from bytes in memory
    pdf_document=fitz.open(stream=file_bytes, filetype="pdf")
    extracted_text=""

    for page_num in range(len(pdf_document)):
        page=pdf_document[page_num]
        extracted_text+=page.get_text()
    pdf_document.close()

    # If nothing was extracted, PDF is likely scanned/image-based
    if not extracted_text.strip():
        return "ERROR: No text found. PDF may be scanned or image-based."
    
    return extracted_text
       