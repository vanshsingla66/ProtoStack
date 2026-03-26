import sys
import json
from utils import extract_text_from_pdf, extract_text_from_docx
from parser import parse_resume

def main():
    try:
        if len(sys.argv) != 2:
            print(json.dumps({"error": "Usage: python parse_cli.py <file_path>"}))
            return

        file_path = sys.argv[1]

        # ✅ Extract text
        if file_path.lower().endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif file_path.lower().endswith(".docx"):
            text = extract_text_from_docx(file_path)
        else:
            print(json.dumps({"error": "Unsupported file extension"}))
            return

        # ✅ Check text extraction
        if not text or text.strip() == "":
            print(json.dumps({"error": "No text extracted from file"}))
            return

        # ✅ Parse resume
        parsed = parse_resume(text)

        # ✅ Handle None case
        if parsed is None:
            print(json.dumps({"error": "Parser returned no data"}))
            return

        # ✅ Ensure JSON output
        print(json.dumps(parsed))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()