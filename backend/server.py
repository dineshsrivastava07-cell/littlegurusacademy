from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Little Gurus Academy API")
api_router = APIRouter(prefix="/api")


# ----------- Models -----------
class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    child_age: str
    program: str
    message: Optional[str] = ""
    source: Optional[str] = "website"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=25)
    child_age: str
    program: str
    message: Optional[str] = ""
    source: Optional[str] = "website"


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: Optional[str] = ""
    message: str = Field(min_length=2, max_length=2000)


class NewsletterSignup(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NewsletterCreate(BaseModel):
    email: EmailStr


# ----------- Routes -----------
@api_router.get("/")
async def root():
    return {"message": "Little Gurus Academy API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "service": "little-gurus-api"}


@api_router.post("/enquiries", response_model=Enquiry, status_code=201)
async def create_enquiry(payload: EnquiryCreate):
    enquiry = Enquiry(**payload.model_dump())
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)
    return enquiry


@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries():
    rows = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return rows


@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return msg


@api_router.post("/newsletter", response_model=NewsletterSignup, status_code=201)
async def newsletter_signup(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        # idempotent: return existing record
        if isinstance(existing.get('created_at'), str):
            existing['created_at'] = datetime.fromisoformat(existing['created_at'])
        return existing
    signup = NewsletterSignup(email=payload.email)
    doc = signup.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.newsletter.insert_one(doc)
    return signup


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
