# AI Resume Parser (FastAPI)

An intelligent **Resume Parser API** that extracts structured information from resumes (PDF / DOCX) and converts it into **JSON format**.

The system uses a **rule-based + NLP approach** to identify key resume sections such as:

* Name
* Email
* Phone
* Skills
* Education
* Experience
* Projects
* Certifications
* Achievements

The API is built using **FastAPI** and provides interactive testing using **Swagger UI**.

---

# Features

• Upload resumes (PDF / DOCX)
• Extract structured resume data automatically
• Skills detection using a predefined skill database
• Section detection (Education, Experience, Projects etc.)
• Resume scoring system
• Job skill matching
• FastAPI interactive API documentation

---

# Tech Stack

Python
FastAPI
spaCy (NLP)
pdfplumber (PDF text extraction)
python-docx (DOCX text extraction)
Uvicorn (ASGI server)

---

# Project Structure

resume-parser

```
resume-parser/
│
├── main.py              # FastAPI API server
├── parser.py            # Resume parsing logic
├── utils.py             # PDF / DOCX text extraction
├── skills.py            # Skills database
├── requirements.txt     # Project dependencies
│
├── uploads/             # Uploaded resumes
├── __pycache__/
└── venv/
```

---

# Installation

### 1 Clone the Repository

```
git clone https://github.com/yourusername/resume-parser.git
cd resume-parser
```

---

### 2 Create Virtual Environment

```
python -m venv venv
```

Activate environment

Windows

```
venv\Scripts\activate
```

Mac/Linux

```
source venv/bin/activate
```

---

### 3 Install Dependencies

```
pip install -r requirements.txt
```

---

### 4 Download spaCy NLP Model

```
python -m spacy download en_core_web_sm
```

---

# Run the API

Start the FastAPI server

```
uvicorn main:app --reload
```

Server will run at

```
http://127.0.0.1:8000
```

---

# API Documentation

FastAPI automatically generates Swagger UI.

Open:

```
http://127.0.0.1:8000/docs
```

You can upload resumes and test the API directly from the browser.

---

# API Endpoint

## Upload Resume

POST `/upload_resume`

Upload a resume file.

Example request

```
curl -X POST \
http://127.0.0.1:8000/upload_resume \
-H "Content-Type: multipart/form-data" \
-F "file=@resume.pdf"
```

---

# Example Output

```
{
"name": "Alex Riverside",
"email": "alex.riverside@email.com",
"phone": null,
"skills": [
"javascript",
"react",
"docker",
"python"
],
"education": [
"Bachelor of Science in Computer Science"
],
"experience": [
"Senior Software Engineer - TechNova Solutions"
],
"projects": [
"Orbit - Open Source Project Management Tool"
],
"certifications": [
"AWS Certified Solutions Architect"
],
"resume_score": 100,
"job_match_score": 75
}
```

---

# How the Resume Parser Works

```
Resume Upload
      ↓
Text Extraction (PDF/DOCX)
      ↓
NLP Processing (spaCy)
      ↓
Section Detection
      ↓
Skills Matching
      ↓
Structured JSON Output
```

---

# Future Improvements

• Train a **custom NLP NER model for resume parsing**
• Improve section detection for different resume formats
• Add **resume ranking system**
• Build **web frontend interface**
• Implement **job recommendation system**

---

# Author

Rahul 
B.Tech Computer Science
GLA University

---

# License

This project is created for educational and research purposes.
