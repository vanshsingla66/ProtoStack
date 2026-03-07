import re
import spacy
from skills import SKILLS_DB

nlp = spacy.load("en_core_web_sm")


def extract_email(text):
    email = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return email[0] if email else None


def extract_phone(text):
    phone = re.findall(r"\+?\d[\d -]{8,12}\d", text)
    return phone[0] if phone else None


def extract_name(text):
    lines = text.split("\n")
    ignore_words = [
        "profile", "skills", "projects", "education",
        "experience", "languages", "frameworks",
        "libraries", "tools"
    ]
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if "@" in line:
            continue
        if any(word in line.lower() for word in ignore_words):
            continue
        words = line.split()
        if 2 <= len(words) <= 3:
            return " ".join(word.capitalize() for word in words)
    return None


def extract_skills(text):
    text = text.lower()
    found_skills = []
    for skill in SKILLS_DB:
        if skill in text:
            found_skills.append(skill)
    return list(set(found_skills))


def extract_sections(text):
    """
    Split resume text into named sections.
    Returns a dict of section_name -> list of lines.
    """
    sections = {
        "education": [],
        "experience": [],
        "skills": [],
        "projects": [],
        "certifications": [],
        "achievements": [],
        "profile": [],
        "other": []
    }

    # Exact section header names to match (whole-line match after stripping)
    # This avoids "AWS Certified..." matching "certifications" keyword
    section_headers = {
        "education":      ["education"],
        "experience":     ["experience", "work experience", "employment"],
        "skills":         ["skills", "technical skills"],
        "projects":       ["projects"],
        "certifications": ["certifications", "certificates", "certification"],
        "achievements":   ["achievements", "achievement", "awards"],
        "profile":        ["profile", "summary", "objective", "about"],
    }

    current_section = "other"

    for line in text.split("\n"):
        line_stripped = line.strip()
        line_lower = line_stripped.lower()

        # A line is a section header ONLY if the entire line exactly equals
        # one of the known header labels (case-insensitive).
        # This prevents "AWS Certified Cloud Practitioner" from matching "certification".
        matched_section = None
        for section, headers in section_headers.items():
            if line_lower in headers:
                matched_section = section
                break

        if matched_section:
            current_section = matched_section
            continue  # skip the header line itself

        if line_stripped:
            sections[current_section].append(line_stripped)

    return sections


def extract_projects(section_lines):
    """
    Extract project entries from the projects section lines.
    A project title is a line with a dash/pipe separator or title-cased short line,
    but NOT an all-caps resume section heading.
    """
    projects = []
    # Known section headings to skip
    section_headings = {
        "technical skills", "work experience", "education",
        "certifications", "professional summary", "projects"
    }

    for line in section_lines:
        line = line.strip()
        if not line:
            continue
        # Skip known section headings
        if line.lower() in section_headings:
            continue
        # Skip bare bullet characters or single punctuation
        if line in ("•", "-", "·", ".", "*"):
            continue
        # Skip very short lines (likely stray bullets or punctuation)
        if len(line) <= 2:
            continue
        projects.append(line)

    return projects


def extract_education(section_lines):
    """
    Extract education entries from the education section lines.
    Looks for degree keywords, not just btech/b.tech.
    """
    degree_keywords = [
        "bachelor", "master", "b.tech", "btech", "b.sc", "bsc",
        "m.tech", "mtech", "m.sc", "msc", "phd", "ph.d",
        "associate", "diploma", "b.e", "be", "mba", "b.com",
        "computer science", "engineering", "technology", "university",
        "college", "institute", "gpa", "graduated"
    ]
    education = []
    for line in section_lines:
        line = line.strip()
        if not line:
            continue
        if any(kw in line.lower() for kw in degree_keywords):
            education.append(line)

    return education


def extract_experience(section_lines):
    """
    Extract experience entries from the experience section lines.
    Keeps lines that are meaningful (more than 3 words).
    """
    experiences = []
    for line in section_lines:
        line = line.strip()
        if len(line.split()) > 3:
            experiences.append(line)
    return experiences


def calculate_resume_score(data):
    score = 0
    score += min(len(data["skills"]) * 4, 40)
    score += min(len(data["education"]) * 10, 20)
    score += min(len(data["experience"]) * 10, 40)
    return score


def match_skills(resume_skills, job_skills):
    matched = []
    for skill in resume_skills:
        if skill.lower() in [j.lower() for j in job_skills]:
            matched.append(skill)
    score = (len(matched) / len(job_skills)) * 100 if job_skills else 0
    return matched, score


def clean_text(text):
    """
    Clean raw PDF-extracted text before parsing.
    Removes (cid:XXX) artifacts, \x7f bullet chars, and unicode bullets.
    """
    text = re.sub(r"\(cid:\d+\)", "", text)
    text = text.replace("\x7f", "")
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    text = text.replace("•", "").replace("·", "").replace("‣", "").replace("⁃", "")
    text = re.sub(r"  +", " ", text)

    # Fix merged section headers: insert newline before known ALL-CAPS headings
    # that got concatenated onto the previous line (common PDF extraction bug)
    # e.g. "AI/ML TrackCERTIFICATIONS" -> "AI/ML Track\nCERTIFICATIONS"
    section_heading_pattern = (
        r'(?<![\n])(EDUCATION|EXPERIENCE|WORK EXPERIENCE|SKILLS|TECHNICAL SKILLS|'
        r'PROJECTS|CERTIFICATIONS|CERTIFICATES|ACHIEVEMENTS|AWARDS|PROFILE|SUMMARY|'
        r'OBJECTIVE|EMPLOYMENT|ABOUT)'
    )
    text = re.sub(section_heading_pattern, r'\n\1', text)

    return text


def parse_resume(text):
    data = {}

    # Clean PDF artifacts before any processing
    text = clean_text(text)

    data["name"] = extract_name(text)
    data["email"] = extract_email(text)
    data["phone"] = extract_phone(text)
    data["skills"] = extract_skills(text)

    # Use extract_sections to correctly split resume into parts
    sections = extract_sections(text)

    data["projects"] = extract_projects(sections["projects"])
    data["education"] = extract_education(sections["education"])
    data["experience"] = extract_experience(sections["experience"])
    data["achievements"] = sections["achievements"]
    data["certifications"] = sections["certifications"]

    data["resume_score"] = calculate_resume_score(data)

    job_skills = ["python", "sql", "machine learning", "docker"]
    matched, match_score = match_skills(data["skills"], job_skills)

    data["matched_skills"] = matched
    data["job_match_score"] = match_score

    return data