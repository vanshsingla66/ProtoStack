import pdfplumber
import docx

def extract_text_from_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    return text


def extract_text_from_docx(file_path):

    doc = docx.Document(file_path)

    text = "\n".join([p.text for p in doc.paragraphs])

    return text