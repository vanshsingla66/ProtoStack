from fastapi import FastAPI, UploadFile, File
import shutil
import os

from utils import extract_text_from_pdf, extract_text_from_docx
from parser import parse_resume

app = FastAPI()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)

    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_path)

    else:
        return {"error": "file format not supported"}

    result = parse_resume(text)

    return result