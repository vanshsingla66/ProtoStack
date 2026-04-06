import sys
import json
import tempfile
from pathlib import Path
from urllib.request import urlopen
from utils import extract_text_from_pdf, extract_text_from_docx
from parser import parse_resume


def is_remote_source(source):
    return source.startswith("http://") or source.startswith("https://")


def extract_text_from_source(source):
    if is_remote_source(source):
        suffix = Path(source.split("?")[0]).suffix.lower()

        if suffix not in (".pdf", ".docx"):
            raise ValueError("Unsupported file extension")

        with urlopen(source, timeout=30) as response:
            file_bytes = response.read()

        with tempfile.NamedTemporaryFile(delete=True, suffix=suffix) as tmp_file:
            tmp_file.write(file_bytes)
            tmp_file.flush()

            if suffix == ".pdf":
                return extract_text_from_pdf(tmp_file.name)

            return extract_text_from_docx(tmp_file.name)

    if source.lower().endswith(".pdf"):
        return extract_text_from_pdf(source)

    if source.lower().endswith(".docx"):
        return extract_text_from_docx(source)

    raise ValueError("Unsupported file extension")


def main():
    try:
        if len(sys.argv) != 2:
            print(json.dumps({"error": "Usage: python parse_cli.py <file_path_or_url>"}))
            return

        source = sys.argv[1]

        text = extract_text_from_source(source)

        if not text or text.strip() == "":
            print(json.dumps({"error": "No text extracted from file"}))
            return

        parsed = parse_resume(text)

        if parsed is None:
            print(json.dumps({"error": "Parser returned no data"}))
            return

        # ✅ ONLY JSON OUTPUT
        print(json.dumps(parsed))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()