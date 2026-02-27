from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from groq import Groq
from dotenv import load_dotenv
import os
import json
import io
import re
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np
# PDF / DOCX text extraction
from pdfminer.high_level import extract_text as pdf_extract_text
from docx import Document as DocxDocument

load_dotenv()

app = FastAPI(title="EduPortal AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────────
# Career Recommendation — ML Model Setup
# ─────────────────────────────────────────────

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
CSV_PATH   = os.path.join(os.path.dirname(__file__), "stud.csv")

FEATURE_NAMES = [
    'Drawing','Dancing','Singing','Sports','Video Game','Acting','Travelling',
    'Gardening','Animals','Photography','Teaching','Exercise','Coding',
    'Electricity Components','Mechanic Parts','Computer Parts','Researching',
    'Architecture','Historic Collection','Botany','Zoology','Physics',
    'Accounting','Economics','Sociology','Geography','Psycology','History',
    'Science','Bussiness Education','Chemistry','Mathematics','Biology',
    'Makeup','Designing','Content writing','Crafting','Literature','Reading',
    'Cartooning','Debating','Asrtology','Hindi','French','English','Urdu',
    'Other Language','Solving Puzzles','Gymnastics','Yoga','Engeeniering',
    'Doctor','Pharmisist','Cycling','Knitting','Director','Journalism',
    'Bussiness','Listening Music'
]

NUMERIC_TO_CATEGORY = {
    0: 'Animation, Graphics and Multimedia',
    1: 'B.Arch- Bachelor of Architecture',
    2: 'B.Com- Bachelor of Commerce',
    3: 'B.Ed.',
    4: 'B.Sc- Applied Geology',
    5: 'B.Sc- Nursing',
    6: 'B.Sc. Chemistry',
    7: 'B.Sc. Mathematics',
    8: 'B.Sc.- Information Technology',
    9: 'B.Sc.- Physics',
    10: 'B.Tech.-Civil Engineering',
    11: 'B.Tech.-Computer Science and Engineering',
    12: 'B.Tech.-Electrical and Electronics Engineering',
    13: 'B.Tech.-Electronics and Communication Engineering',
    14: 'B.Tech.-Mechanical Engineering',
    15: 'BA in Economics',
    16: 'BA in English',
    17: 'BA in Hindi',
    18: 'BA in History',
    19: 'BBA- Bachelor of Business Administration',
    20: 'BBS- Bachelor of Business Studies',
    21: 'BCA- Bachelor of Computer Applications',
    22: 'BDS- Bachelor of Dental Surgery',
    23: 'BEM- Bachelor of Event Management',
    24: 'BFD- Bachelor of Fashion Designing',
    25: 'BJMC- Bachelor of Journalism and Mass Communication',
    26: 'BPharma- Bachelor of Pharmacy',
    27: 'BTTM- Bachelor of Travel and Tourism Management',
    28: 'BVA- Bachelor of Visual Arts',
    29: 'CA- Chartered Accountancy',
    30: 'CS- Company Secretary',
    31: 'Civil Services',
    32: 'Diploma in Dramatic Arts',
    33: 'Integrated Law Course- BA + LL.B',
    34: 'MBBS'
}

# RIASEC Personality Test Data
HOLLAND_QUESTIONS = {
    "R": [
        "I enjoy working with machines and tools.",
        "I like to work with numbers and solve mathematical problems.",
        "I prefer practical tasks over abstract ones."
    ],
    "I": [
        "I enjoy solving puzzles and brain teasers.",
        "I like conducting experiments and exploring new ideas.",
        "I enjoy analyzing data to find patterns and trends."
    ],
    "A": [
        "I enjoy drawing, painting, or creating visual art.",
        "I like expressing myself through music or dance.",
        "I like writing poetry or stories."
    ],
    "S": [
        "I enjoy helping people solve their problems.",
        "I like volunteering and contributing to my community.",
        "I enjoy teaching and educating others."
    ],
    "E": [
        "I enjoy taking on leadership roles and responsibilities.",
        "I like persuading and convincing others.",
        "I like organizing events and gatherings."
    ],
    "C": [
        "I prefer working with numbers and data.",
        "I like creating and following organized systems.",
        "I enjoy record-keeping and data analysis."
    ]
}

PERSONALITY_INFO = {
    "R": {
        "name": "Realistic",
        "description": "Practical, hands-on, and enjoy working with tools, machines, or physical activity.",
        "careers": ["Carpenter", "Electrician", "Mechanic", "Plumber", "Welder", "Engineer"]
    },
    "I": {
        "name": "Investigative",
        "description": "Analytical, intellectual, and enjoy solving complex problems through research.",
        "careers": ["Scientist", "Engineer", "Researcher", "Computer Programmer", "Mathematician", "Doctor"]
    },
    "A": {
        "name": "Artistic",
        "description": "Creative, expressive, and enjoy art, design, writing, and music.",
        "careers": ["Artist", "Graphic Designer", "Writer", "Interior Designer", "Photographer", "Architect"]
    },
    "S": {
        "name": "Social",
        "description": "Compassionate, cooperative, and enjoy helping and caring for others.",
        "careers": ["Teacher", "Social Worker", "Nurse", "Counselor", "Psychologist", "HR Manager"]
    },
    "E": {
        "name": "Enterprising",
        "description": "Ambitious, persuasive, and enjoy leadership roles and entrepreneurship.",
        "careers": ["Entrepreneur", "Sales Manager", "Marketing Manager", "Business Consultant", "Lawyer"]
    },
    "C": {
        "name": "Conventional",
        "description": "Detail-oriented, organized, and enjoy managing data, systems, and tasks.",
        "careers": ["Accountant", "Financial Analyst", "Data Analyst", "Office Manager", "Banker"]
    }
}

def _train_from_csv() -> object:
    """Train a fresh RandomForest model from stud.csv and persist it."""
    if not os.path.exists(CSV_PATH):
        print("❌ stud.csv not found. Career prediction disabled.")
        return None
    try:
        print("🔧 Training career recommendation model from stud.csv …")
        data = pd.read_csv(CSV_PATH)
        label_encoder = LabelEncoder()
        data["Courses_label"] = label_encoder.fit_transform(data["Courses"])
        for col in FEATURE_NAMES:
            if col in data.columns:
                le = LabelEncoder()
                data[col] = le.fit_transform(data[col].astype(str))
        dataab = data.drop(["Courses"], axis=1)
        X_df = dataab[FEATURE_NAMES]
        Y = dataab["Courses_label"]
        X_train, X_test, y_train, y_test = train_test_split(X_df, Y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        joblib.dump(model, MODEL_PATH)
        print("✅ Model trained and saved.")
        return model
    except Exception as e:
        print(f"❌ Failed to train model: {e}")
        return None


def load_or_train_model():
    """Load pre-trained model; retrain from CSV if pkl is missing or version-incompatible."""
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            # Validate the loaded model with a dummy prediction to catch sklearn
            # version mismatches (e.g. missing 'monotonic_cst' attribute).
            dummy = pd.DataFrame([{f: 0 for f in FEATURE_NAMES}])
            model.predict(dummy)
            print("✅ Career ML model loaded and validated successfully.")
            return model
        except AttributeError as e:
            print(f"⚠️  model.pkl is incompatible with current sklearn ({e}). Retraining …")
            try:
                os.remove(MODEL_PATH)
            except OSError:
                pass
        except Exception as e:
            print(f"⚠️  Could not load model.pkl: {e}. Retraining …")
            try:
                os.remove(MODEL_PATH)
            except OSError:
                pass

    return _train_from_csv()

career_model = load_or_train_model()

# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────

class MessageRequest(BaseModel):
    message: str

class ExamQuestionRequest(BaseModel):
    exam_type: str
    topic: str
    num_questions: int
    difficulty: str = "medium"

class TrendRequest(BaseModel):
    course: str

class PersonalityAnswers(BaseModel):
    answers: Dict[str, List[int]]

class Interests(BaseModel):
    interests: Dict[str, int]

class PersonalityResult(BaseModel):
    dominant_type: str
    description: str
    careers: List[str]
    scores: Dict[str, float]

class CoursePrediction(BaseModel):
    predicted_course: str
    confidence: Optional[float] = None

# ─────────────────────────────────────────────
# Career Recommendation Endpoints
# ─────────────────────────────────────────────

@app.get("/career/personality-questions")
def get_personality_questions():
    return HOLLAND_QUESTIONS

@app.post("/career/personality-test", response_model=PersonalityResult)
def submit_personality_test(answers: PersonalityAnswers):
    cumulative_scores: Dict[str, float] = {}
    for ptype, ans_list in answers.answers.items():
        if ptype not in HOLLAND_QUESTIONS:
            raise HTTPException(status_code=400, detail=f"Invalid personality type: {ptype}")
        expected = len(HOLLAND_QUESTIONS[ptype])
        if len(ans_list) != expected:
            raise HTTPException(
                status_code=400,
                detail=f"Type '{ptype}' expects {expected} answers, got {len(ans_list)}"
            )
        cumulative_scores[ptype] = float(sum(ans_list))

    if not cumulative_scores:
        raise HTTPException(status_code=400, detail="No answers provided.")

    dominant = max(cumulative_scores, key=cumulative_scores.get)
    total = sum(cumulative_scores.values()) or 1.0
    percentages = {k: round((v / total) * 100, 2) for k, v in cumulative_scores.items()}

    return PersonalityResult(
        dominant_type=PERSONALITY_INFO[dominant]["name"],
        description=PERSONALITY_INFO[dominant]["description"],
        careers=PERSONALITY_INFO[dominant]["careers"],
        scores=percentages
    )

@app.post("/career/predict-course", response_model=CoursePrediction)
def predict_course(interests: Interests):
    if career_model is None:
        raise HTTPException(
            status_code=503,
            detail="Career ML model is not available. Please ensure model.pkl exists in ai-service/."
        )
    user_input = {feature: interests.interests.get(feature, 0) for feature in FEATURE_NAMES}
    user_data = pd.DataFrame([user_input])

    prediction = career_model.predict(user_data)
    numeric_pred = int(prediction[0])

    # Get confidence via predict_proba
    confidence = None
    try:
        proba = career_model.predict_proba(user_data)
        confidence = round(float(np.max(proba)), 4)
    except Exception:
        pass

    course = NUMERIC_TO_CATEGORY.get(numeric_pred, "Unknown")
    return CoursePrediction(predicted_course=course, confidence=confidence)

@app.get("/career/features")
def get_interest_features():
    """Returns the list of all 58 interest feature names for the frontend."""
    return {"features": FEATURE_NAMES}

# ─────────────────────────────────────────────
# LLM / Groq Endpoints (existing)
# ─────────────────────────────────────────────

@app.post("/ask")
async def ask_ai(request: MessageRequest):
    completion = client.chat.completions.create(
        model="groq/compound",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Always respond in 2-3 simple bullet points or one short paragraph. Keep answers concise and easy to understand."
            },
            {"role": "user", "content": request.message}
        ],
        temperature=0.7,
        max_completion_tokens=1024,
        compound_custom={"tools": {"enabled_tools": ["web_search", "code_interpreter", "visit_website"]}}
    )
    return {"reply": completion.choices[0].message.content}


@app.post("/chat")
async def chat_ai(request: MessageRequest):
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Respond in 6-7 simple bullet points. No greetings."
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.7,
            max_tokens=1024,
            stream=False  # IMPORTANT
        )

        reply = completion.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        import logging
        logging.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail="AI service failed.")

@app.post("/generate-questions")
async def generate_questions(request: ExamQuestionRequest):
    prompt = f"""
    Generate questions for the following exam:

    Exam Type: {request.exam_type}
    Topic: {request.topic}
    Number of Questions for practice: {request.num_questions}
    Difficulty: {request.difficulty}

    IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, code blocks, or extra text.

    JSON structure:
    {{
        "practice_questions": [
            {{
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "A",
                "solution": "Detailed solution explanation"
            }}
        ],
        "quiz_questions": [
            {{
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "A",
                "solution": "Detailed solution explanation"
            }}
        ]
    }}

    Generate exactly {request.num_questions} practice questions and 10 quiz questions.
    Make questions relevant to {request.exam_type} exam pattern and {request.topic} topic.
    """

    try:
        completion = client.chat.completions.create(
            model="groq/compound",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert exam question generator. You must respond ONLY with valid JSON. No markdown, no code blocks, no explanations. Just pure JSON."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_completion_tokens=2048,
            compound_custom={"tools": {"enabled_tools": ["web_search", "code_interpreter"]}}
        )
        raw_content = completion.choices[0].message.content.strip()
    except Exception:
        # Try fallback model
        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert exam question generator. You must respond ONLY with valid JSON. No markdown, no code blocks, no explanations. Just pure JSON."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_completion_tokens=2048,
            )
            raw_content = completion.choices[0].message.content.strip()
        except Exception as e2:
            import logging
            logging.error(f"All Groq models failed for generate-questions: {e2}")
            fallback_data = {
                "practice_questions": [
                    {
                        "question": f"Sample practice question {i+1} for {request.topic} ({request.exam_type})",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct_answer": "A",
                        "solution": f"This is a placeholder — please add a valid GROQ_API_KEY to ai-service/.env"
                    } for i in range(min(request.num_questions, 5))
                ],
                "quiz_questions": [
                    {
                        "question": f"Sample quiz question {i+1} for {request.topic} ({request.exam_type})",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct_answer": "A",
                        "solution": f"This is a placeholder — please add a valid GROQ_API_KEY to ai-service/.env"
                    } for i in range(10)
                ]
            }
            return {"exam_type": request.exam_type, "topic": request.topic, "questions": json.dumps(fallback_data)}

    for prefix in ["```json", "```"]:
        if raw_content.startswith(prefix):
            raw_content = raw_content[len(prefix):]
    if raw_content.endswith("```"):
        raw_content = raw_content[:-3]
    raw_content = raw_content.strip()

    try:
        parsed_data = json.loads(raw_content)
        if "practice_questions" not in parsed_data or "quiz_questions" not in parsed_data:
            raise ValueError("Missing required fields")
        parsed_data["practice_questions"] = parsed_data["practice_questions"][:request.num_questions]
        return {"exam_type": request.exam_type, "topic": request.topic, "questions": json.dumps(parsed_data)}
    except (json.JSONDecodeError, ValueError):
        fallback_data = {
            "practice_questions": [
                {
                    "question": f"Sample question {i+1} for {request.topic}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "A",
                    "solution": f"Sample solution {i+1}"
                } for i in range(min(request.num_questions, 5))
            ],
            "quiz_questions": [
                {
                    "question": f"Quiz question {i+1} for {request.topic}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "A",
                    "solution": f"Quiz solution {i+1}"
                } for i in range(10)
            ]
        }
        return {"exam_type": request.exam_type, "topic": request.topic, "questions": json.dumps(fallback_data)}


@app.post("/latest-trends")
async def latest_trends(request: TrendRequest):
    prompt = f"""
User is studying {request.course}.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no extra text.

Provide the latest trends for this field. Use EXACTLY this JSON structure:
{{
    "course": "{request.course}",
    "trending_domains": [
        {{"name": "Domain Name", "description": "1-2 sentence description of why this is trending.", "growth": "e.g. +45% YoY"}},
        {{"name": "Domain Name 2", "description": "Description.", "growth": "+30% YoY"}},
        {{"name": "Domain Name 3", "description": "Description.", "growth": "+25% YoY"}},
        {{"name": "Domain Name 4", "description": "Description.", "growth": "+20% YoY"}},
        {{"name": "Domain Name 5", "description": "Description.", "growth": "+15% YoY"}}
    ],
    "technologies": ["tech1", "tech2", "tech3", "tech4", "tech5", "tech6"],
    "roadmap": [
        {{"step": "Step 1: Title", "description": "What to learn and do.", "duration": "X months"}},
        {{"step": "Step 2: Title", "description": "What to learn and do.", "duration": "X months"}},
        {{"step": "Step 3: Title", "description": "What to learn and do.", "duration": "X months"}},
        {{"step": "Step 4: Title", "description": "What to learn and do.", "duration": "Ongoing"}}
    ],
    "tools": ["tool1", "tool2", "tool3", "tool4"],
    "career_roles": ["role1", "role2", "role3"],
    "future_scope": "2-3 sentence summary of the future outlook for this field."
}}
"""

    def _fallback():
        return {
            "course": request.course,
            "trending_domains": [
                {"name": "Artificial Intelligence", "description": f"AI is transforming {request.course} with automation and intelligent systems.", "growth": "+48% YoY"},
                {"name": "Cloud Computing", "description": "Scalable infrastructure is now a core skill across all tech domains.", "growth": "+35% YoY"},
                {"name": "Data Engineering", "description": "Handling large-scale data pipelines is in high demand.", "growth": "+30% YoY"},
                {"name": "DevOps & MLOps", "description": "Bridging development and operations pipelines for faster delivery.", "growth": "+25% YoY"},
                {"name": "Cybersecurity", "description": "Protecting systems and data is a growing priority for every organisation.", "growth": "+20% YoY"},
            ],
            "technologies": ["Python", "Docker", "Kubernetes", "TensorFlow", "AWS", "Git"],
            "roadmap": [
                {"step": "Step 1: Foundations", "description": f"Build a solid base in {request.course} fundamentals.", "duration": "3-4 months"},
                {"step": "Step 2: Hands-on Projects", "description": "Build 2-3 real-world portfolio projects.", "duration": "3-4 months"},
                {"step": "Step 3: Specialisation", "description": "Deep-dive into one high-demand sub-domain.", "duration": "3-4 months"},
                {"step": "Step 4: Industry Readiness", "description": "Prepare for interviews, certifications, and open-source contributions.", "duration": "Ongoing"},
            ],
            "tools": ["Git", "Docker", "VS Code", "Postman"],
            "career_roles": [f"{request.course} Engineer", f"{request.course} Architect", "Technical Lead"],
            "future_scope": f"{request.course} is one of the fastest-growing fields globally with strong demand and competitive salaries. Professionals with specialised skills can expect significant career growth over the next decade.",
        }

    raw_content = None
    try:
        groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert career advisor. Respond ONLY with valid JSON. No markdown, no explanations."},
                {"role": "user",   "content": prompt},
            ],
            temperature=0.5,
            max_tokens=2048,
        )
        raw_content = completion.choices[0].message.content.strip()
        for fence in ["```json", "```"]:
            if raw_content.startswith(fence):
                raw_content = raw_content[len(fence):]
        if raw_content.endswith("```"):
            raw_content = raw_content[:-3]
        raw_content = raw_content.strip()
        parsed_data = json.loads(raw_content)
        # Normalise trending_domains: if strings came back, upgrade to objects
        domains = parsed_data.get("trending_domains", [])
        if domains and isinstance(domains[0], str):
            parsed_data["trending_domains"] = [
                {"name": d, "description": f"{d} is a rapidly growing area in {request.course}.", "growth": ""}
                for d in domains
            ]
        if "course" not in parsed_data:
            parsed_data["course"] = request.course
        return {"course": request.course, "trends": json.dumps(parsed_data)}
    except Exception as e:
        import logging
        logging.error(f"/latest-trends error: {e}. Using fallback.")
        return {"course": request.course, "trends": json.dumps(_fallback())}


# ─────────────────────────────────────────────
# Career Screener — /full-analysis
# ─────────────────────────────────────────────

def _extract_text_from_upload(upload_bytes: bytes, filename: str) -> str:
    """Extract plain text from PDF or DOCX bytes."""
    fname = (filename or "").lower()
    try:
        if fname.endswith(".pdf"):
            return pdf_extract_text(io.BytesIO(upload_bytes))
        elif fname.endswith(".docx"):
            doc = DocxDocument(io.BytesIO(upload_bytes))
            return "\n".join(p.text for p in doc.paragraphs)
        else:
            # Try raw UTF-8 (plain text files)
            return upload_bytes.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not read file '{filename}': {e}")


def _keyword_fallback(resume_text: str, jd_text: str) -> dict:
    """Simple regex-based skill extractor used when Groq is unavailable."""
    SKILL_PATTERNS = [
        r"python", r"java(?:script)?", r"react", r"node\.?js", r"sql", r"mongodb",
        r"docker", r"kubernetes", r"aws", r"azure", r"machine learning", r"deep learning",
        r"tensorflow", r"pytorch", r"fastapi", r"spring", r"git", r"linux", r"c\+\+",
        r"typescript", r"html", r"css", r"django", r"flask", r"pandas", r"numpy",
        r"excel", r"power bi", r"tableau", r"spark", r"hadoop", r"kafka",
    ]
    def extract(text):
        found = set()
        tl = text.lower()
        for p in SKILL_PATTERNS:
            if re.search(p, tl):
                found.add(p.replace(r"\.", ".").replace(r"(?:script)?", "script").strip("(").strip("\\?"))
        return sorted(found)

    resume_skills = extract(resume_text)
    job_skills    = extract(jd_text)
    matched = sorted(set(resume_skills) & set(job_skills))
    missing = sorted(set(job_skills)   - set(resume_skills))
    score = round((len(matched) / max(len(job_skills), 1)) * 100, 1)
    resources = {s: f"https://www.coursera.org/search?query={s.replace(' ', '+')}" for s in missing[:5]}
    return {
        "match_score": score,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "prediction": {"prediction": "Good Match" if score >= 60 else "Needs Improvement", "confidence": round(score / 100, 2)},
        "learning_resources": resources,
        "project_ideas": "Build end-to-end projects that use the missing skills above to bridge your gap.",
    }


@app.post("/full-analysis")
async def full_analysis(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...),
):
    resume_bytes = await resume.read()
    jd_bytes     = await job_description.read()

    resume_text = _extract_text_from_upload(resume_bytes, resume.filename or "resume.txt")
    jd_text     = _extract_text_from_upload(jd_bytes,     job_description.filename or "jd.txt")

    # Trim to avoid exceeding token limits
    resume_text = resume_text[:4000]
    jd_text     = jd_text[:3000]

    prompt = f"""
You are an expert HR analyst and career coach. Analyze the following resume and job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}

Respond ONLY with valid JSON in exactly this structure — no markdown, no extra text:
{{
  "match_score": <number 0-100>,
  "resume_skills": [<list of skills found in resume>],
  "job_skills": [<list of skills required by job>],
  "matched_skills": [<skills present in both>],
  "missing_skills": [<skills in job but not in resume>],
  "prediction": {{
    "prediction": "<Strong Match|Good Match|Partial Match|Needs Improvement>",
    "confidence": <number 0-1>
  }},
  "learning_resources": {{
    "<missing skill>": "<https://coursera or udemy link>"
  }},
  "project_ideas": "<2-3 sentence paragraph on portfolio project ideas to bridge the gap>"
}}
"""

    raw = None
    try:
        groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert HR analyst. Respond ONLY with valid JSON. No markdown."},
                {"role": "user",   "content": prompt},
            ],
            temperature=0.3,
            max_tokens=2048,
        )
        raw = completion.choices[0].message.content.strip()
        # Strip markdown fences if present
        for fence in ["```json", "```"]:
            if raw.startswith(fence):
                raw = raw[len(fence):]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()
        result = json.loads(raw)
        # Ensure required keys exist
        required = ["match_score", "resume_skills", "job_skills", "matched_skills",
                    "missing_skills", "prediction", "learning_resources", "project_ideas"]
        if not all(k in result for k in required):
            raise ValueError("Missing fields in Groq response")
        return result
    except Exception as e:
        import logging
        logging.error(f"/full-analysis Groq error: {e}. Using keyword fallback.")
        return _keyword_fallback(resume_text, jd_text)
