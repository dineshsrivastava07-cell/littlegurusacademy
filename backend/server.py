"""Little Gurus Academy — backend (FastAPI + Motor + MongoDB).

All endpoints under /api. Auth via Bearer JWT (see auth.py).
Endpoints are organised into routers per area but mounted on the same prefix.
"""
from __future__ import annotations

from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import random
from datetime import datetime, timezone, date
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends, Query, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

from email_service import send_enquiry_emails, send_contact_email
from auth import (
    hash_password, verify_password, create_token,
    require_admin, require_student,
)

# ---- DB ----
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Little Gurus Academy API")
api = APIRouter(prefix="/api")


# ============================================================ UTILITIES
def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return now_utc().isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


def serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


async def list_docs(collection, query: dict | None = None, sort_field: str = "created_at", limit: int = 1000):
    cursor = collection.find(query or {}, {"_id": 0}).sort(sort_field, -1).limit(limit)
    return [d async for d in cursor]


# ============================================================ SCHEMAS
class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    name: str
    email: EmailStr
    phone: str
    child_age: str
    program: str
    message: Optional[str] = ""
    source: Optional[str] = "website"
    status: Optional[str] = "New"
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=iso_now)


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
    id: str = Field(default_factory=new_id)
    name: str
    email: EmailStr
    subject: Optional[str] = ""
    message: str
    status: Optional[str] = "New"
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=iso_now)


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: Optional[str] = ""
    message: str = Field(min_length=2, max_length=2000)


class NewsletterCreate(BaseModel):
    email: EmailStr


class TourBookingCreate(BaseModel):
    parent_name: str = Field(min_length=2, max_length=80)
    child_name: str = Field(min_length=1, max_length=80)
    child_age: str
    email: EmailStr
    phone: str
    preferred_date: str
    preferred_slot: str
    program: str
    message: Optional[str] = ""


class TourBookingUpdate(BaseModel):
    status: Optional[str] = None  # Pending / Confirmed / Completed / Cancelled
    notes: Optional[str] = None


class ApplicationCreate(BaseModel):
    parent_name: str
    child_name: str
    child_dob: str  # YYYY-MM-DD
    child_age: str
    gender: str
    email: EmailStr
    phone: str
    city: Optional[str] = "Gurgaon"
    program: str
    source: Optional[str] = "website"
    notes: Optional[str] = ""


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AdminLogin(BaseModel):
    username: str
    password: str


class StudentLogin(BaseModel):
    email: EmailStr
    password: str


class StudentCreate(BaseModel):
    name: str
    parent_name: Optional[str] = ""
    parent_phone: Optional[str] = ""
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    program: str
    age_group: Optional[str] = ""
    status: Optional[str] = "Active"
    next_billing_date: Optional[str] = ""


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    program: Optional[str] = None
    age_group: Optional[str] = None
    status: Optional[str] = None
    next_billing_date: Optional[str] = None
    new_password: Optional[str] = None


class TestimonialCreate(BaseModel):
    parent_name: str
    child_info: Optional[str] = ""  # "Child age 5, Tiny Tots"
    text: str
    rating: int = Field(ge=1, le=5, default=5)
    photo_url: Optional[str] = ""
    published: bool = True


class TestimonialUpdate(BaseModel):
    parent_name: Optional[str] = None
    child_info: Optional[str] = None
    text: Optional[str] = None
    rating: Optional[int] = None
    photo_url: Optional[str] = None
    published: Optional[bool] = None


class VideoCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    subject: str  # Math / English / Science / Art / General
    age_group: str  # 2-4 / 4-6 / 6-8 / 8-10 / All
    video_url: str
    thumbnail_url: Optional[str] = ""
    duration: Optional[str] = ""
    is_free: bool = True


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    age_group: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    is_free: Optional[bool] = None


class TeacherCreate(BaseModel):
    name: str
    role: str  # subject/specialization shown on About
    bio: str
    qualifications: Optional[str] = ""
    photo_url: Optional[str] = ""
    joining_date: Optional[str] = ""
    active: bool = True
    order: int = 100


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    qualifications: Optional[str] = None
    photo_url: Optional[str] = None
    joining_date: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None


class MessageCreate(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    student_id: Optional[str] = None  # admin must specify; student infers from token


class TicketCreate(BaseModel):
    type: str  # Class Missed - Request Recording / Technical Issue / Fee Query / ...
    description: str = Field(min_length=2, max_length=4000)


class TicketUpdate(BaseModel):
    status: Optional[str] = None  # Open / In Progress / Resolved
    response: Optional[str] = None


class AdminPasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=64)


class SiteSettingsUpdate(BaseModel):
    hero_headline: Optional[str] = None
    hero_subhead: Optional[str] = None
    tagline: Optional[str] = None
    about_story: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    business_hours: Optional[str] = None
    address: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    notification_email: Optional[str] = None
    pricing: Optional[List[dict]] = None  # [{program, sessions, weekly, monthly, quarterly}]


# ============================================================ HEALTH
@api.get("/")
async def root():
    return {"message": "Little Gurus Academy API", "status": "ok"}


@api.get("/health")
async def health():
    return {"status": "healthy", "service": "little-gurus-api"}


# ============================================================ PUBLIC FORMS
@api.post("/enquiries", response_model=Enquiry, status_code=201)
async def create_enquiry(payload: EnquiryCreate, background: BackgroundTasks):
    enq = Enquiry(**payload.model_dump())
    await db.enquiries.insert_one(enq.model_dump())
    background.add_task(
        send_enquiry_emails,
        enq.name, enq.email, enq.phone,
        enq.child_age, enq.program, enq.message or "",
    )
    return enq


@api.get("/enquiries", response_model=List[Enquiry], dependencies=[Depends(require_admin)])
async def list_enquiries():
    return await list_docs(db.enquiries)


class EnquiryUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


@api.patch("/enquiries/{enq_id}", dependencies=[Depends(require_admin)])
async def update_enquiry(enq_id: str, payload: EnquiryUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    result = await db.enquiries.update_one({"id": enq_id}, {"$set": upd})
    if result.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(payload: ContactMessageCreate, background: BackgroundTasks):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    background.add_task(send_contact_email, msg.name, msg.email, msg.subject or "", msg.message)
    return msg


@api.post("/newsletter", status_code=201)
async def newsletter(payload: NewsletterCreate):
    doc = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if doc:
        return doc
    doc = {"id": new_id(), "email": payload.email, "created_at": iso_now()}
    await db.newsletter.insert_one(doc)
    return serialize(doc)


# ============================================================ TOUR BOOKINGS
@api.post("/tour-bookings", status_code=201)
async def create_tour_booking(payload: TourBookingCreate, background: BackgroundTasks):
    doc = {
        "id": new_id(),
        **payload.model_dump(),
        "status": "Pending",
        "notes": "",
        "created_at": iso_now(),
    }
    await db.tour_bookings.insert_one(doc)
    # fire admin email (background)
    background.add_task(
        send_enquiry_emails,
        f"{payload.parent_name} ({payload.child_name}, {payload.child_age})",
        payload.email, payload.phone, payload.child_age,
        f"TOUR · {payload.program}",
        f"Preferred: {payload.preferred_date} at {payload.preferred_slot}\n\n{payload.message or ''}",
    )
    return {"ok": True, "id": doc["id"], "booking": serialize(doc)}


@api.get("/tour-bookings", dependencies=[Depends(require_admin)])
async def list_tour_bookings():
    return await list_docs(db.tour_bookings)


@api.patch("/tour-bookings/{bid}", dependencies=[Depends(require_admin)])
async def update_tour_booking(bid: str, payload: TourBookingUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    res = await db.tour_bookings.update_one({"id": bid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


# ============================================================ APPLICATIONS
async def _next_application_ref() -> str:
    today = now_utc().strftime("%Y%m%d")
    suffix = f"{random.randint(0, 9999):04d}"
    return f"LGA-{today}-{suffix}"


@api.post("/applications", status_code=201)
async def create_application(payload: ApplicationCreate, background: BackgroundTasks):
    # Ensure unique reference number
    for _ in range(5):
        ref = await _next_application_ref()
        if not await db.applications.find_one({"reference": ref}):
            break
    doc = {
        "id": new_id(),
        "reference": ref,
        **payload.model_dump(),
        "status": "Pending",
        "admin_notes": "",
        "created_at": iso_now(),
    }
    await db.applications.insert_one(doc)
    background.add_task(
        send_enquiry_emails,
        f"{payload.parent_name} ({payload.child_name}, {payload.child_age})",
        payload.email, payload.phone, payload.child_age,
        f"APPLICATION {ref} · {payload.program}",
        f"DOB: {payload.child_dob}\nGender: {payload.gender}\nCity: {payload.city}\nSource: {payload.source}\n\n{payload.notes or ''}",
    )
    return {"ok": True, "id": doc["id"], "reference": ref}


@api.get("/applications", dependencies=[Depends(require_admin)])
async def list_applications():
    return await list_docs(db.applications)


@api.patch("/applications/{app_id}", dependencies=[Depends(require_admin)])
async def update_application(app_id: str, payload: ApplicationUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "notes" in upd:
        upd["admin_notes"] = upd.pop("notes")
    if not upd:
        return {"ok": True}
    res = await db.applications.update_one({"id": app_id}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.get("/application-status")
async def application_status(ref: Optional[str] = None, email: Optional[str] = None):
    if not ref and not email:
        raise HTTPException(400, "Provide reference or email")
    q = {}
    if ref:
        q["reference"] = ref.strip().upper()
    if email:
        q["email"] = email.strip().lower()
    docs = await db.applications.find(q, {"_id": 0, "admin_notes": 0}).sort("created_at", -1).to_list(20)
    if not docs:
        raise HTTPException(404, "No application found")
    return {"applications": docs}


# ============================================================ AUTH
@api.post("/admin/login")
async def admin_login(payload: AdminLogin):
    admin = await db.admin_users.find_one({"username": payload.username.strip().lower()})
    if not admin or not verify_password(payload.password, admin["password_hash"]):
        raise HTTPException(401, "Invalid username or password")
    token = create_token(sub=admin["id"], role="admin", extra={"username": admin["username"]})
    return {
        "token": token,
        "user": {"id": admin["id"], "username": admin["username"], "role": "admin"},
    }


@api.post("/admin/change-password", dependencies=[Depends(require_admin)])
async def admin_change_password(payload: AdminPasswordChange, _=Depends(require_admin)):
    admin = await db.admin_users.find_one({"username": "admin"})
    if not admin or not verify_password(payload.current_password, admin["password_hash"]):
        raise HTTPException(400, "Current password incorrect")
    await db.admin_users.update_one(
        {"id": admin["id"]},
        {"$set": {"password_hash": hash_password(payload.new_password), "updated_at": iso_now()}},
    )
    return {"ok": True}


@api.post("/student/login")
async def student_login(payload: StudentLogin):
    s = await db.students.find_one({"email": payload.email.lower()})
    if not s or not verify_password(payload.password, s.get("password_hash", "")):
        raise HTTPException(401, "Invalid email or password")
    if s.get("status") != "Active":
        raise HTTPException(403, "Student account is not active. Contact us.")
    token = create_token(sub=s["id"], role="student", extra={"email": s["email"], "name": s.get("name", "")})
    return {
        "token": token,
        "user": {
            "id": s["id"], "email": s["email"], "name": s.get("name", ""),
            "program": s.get("program", ""), "role": "student",
        },
    }


@api.get("/student/me")
async def student_me(claims: dict = Depends(require_student)):
    s = await db.students.find_one({"id": claims["sub"]}, {"_id": 0, "password_hash": 0})
    if not s:
        raise HTTPException(404, "Student not found")
    return s


# ============================================================ STUDENTS (admin)
@api.post("/students", status_code=201, dependencies=[Depends(require_admin)])
async def create_student(payload: StudentCreate):
    existing = await db.students.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(409, "A student with this email already exists")
    doc = {
        "id": new_id(),
        "name": payload.name,
        "parent_name": payload.parent_name,
        "parent_phone": payload.parent_phone,
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "program": payload.program,
        "age_group": payload.age_group,
        "status": payload.status or "Active",
        "next_billing_date": payload.next_billing_date or "",
        "created_at": iso_now(),
    }
    await db.students.insert_one(doc)
    out = {k: v for k, v in doc.items() if k not in ("password_hash", "_id")}
    return out


@api.get("/students", dependencies=[Depends(require_admin)])
async def list_students():
    cursor = db.students.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1)
    return await cursor.to_list(1000)


@api.patch("/students/{sid}", dependencies=[Depends(require_admin)])
async def update_student(sid: str, payload: StudentUpdate):
    upd: dict = {}
    for k, v in payload.model_dump().items():
        if v is None or k == "new_password":
            continue
        upd[k] = v
    if payload.new_password:
        upd["password_hash"] = hash_password(payload.new_password)
    if not upd:
        return {"ok": True}
    upd["updated_at"] = iso_now()
    res = await db.students.update_one({"id": sid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


# ============================================================ TESTIMONIALS
@api.get("/testimonials")
async def list_testimonials(published: Optional[bool] = None):
    q: dict = {}
    if published is True:
        q["published"] = True
    cursor = db.testimonials.find(q, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(200)


@api.post("/testimonials", status_code=201, dependencies=[Depends(require_admin)])
async def create_testimonial(payload: TestimonialCreate):
    doc = {"id": new_id(), **payload.model_dump(), "created_at": iso_now()}
    await db.testimonials.insert_one(doc)
    return serialize(doc)


@api.patch("/testimonials/{tid}", dependencies=[Depends(require_admin)])
async def update_testimonial(tid: str, payload: TestimonialUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    res = await db.testimonials.update_one({"id": tid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.delete("/testimonials/{tid}", dependencies=[Depends(require_admin)])
async def delete_testimonial(tid: str):
    await db.testimonials.delete_one({"id": tid})
    return {"ok": True}


# ============================================================ VIDEOS
@api.get("/videos")
async def list_videos(free: Optional[bool] = None, age_group: Optional[str] = None):
    q: dict = {}
    if free is True:
        q["is_free"] = True
    if age_group:
        q["$or"] = [{"age_group": age_group}, {"age_group": "All"}]
    cursor = db.videos.find(q, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(500)


@api.post("/videos", status_code=201, dependencies=[Depends(require_admin)])
async def create_video(payload: VideoCreate):
    doc = {"id": new_id(), **payload.model_dump(), "created_at": iso_now()}
    await db.videos.insert_one(doc)
    return serialize(doc)


@api.patch("/videos/{vid}", dependencies=[Depends(require_admin)])
async def update_video(vid: str, payload: VideoUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    res = await db.videos.update_one({"id": vid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.delete("/videos/{vid}", dependencies=[Depends(require_admin)])
async def delete_video(vid: str):
    await db.videos.delete_one({"id": vid})
    return {"ok": True}


# ============================================================ TEACHERS
@api.get("/teachers")
async def list_teachers(active: Optional[bool] = None):
    q: dict = {}
    if active is True:
        q["active"] = True
    cursor = db.teachers.find(q, {"_id": 0}).sort([("order", 1), ("created_at", -1)])
    return await cursor.to_list(200)


@api.post("/teachers", status_code=201, dependencies=[Depends(require_admin)])
async def create_teacher(payload: TeacherCreate):
    doc = {"id": new_id(), **payload.model_dump(), "created_at": iso_now()}
    await db.teachers.insert_one(doc)
    return serialize(doc)


@api.patch("/teachers/{tid}", dependencies=[Depends(require_admin)])
async def update_teacher(tid: str, payload: TeacherUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    res = await db.teachers.update_one({"id": tid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.delete("/teachers/{tid}", dependencies=[Depends(require_admin)])
async def delete_teacher(tid: str):
    await db.teachers.delete_one({"id": tid})
    return {"ok": True}


# ============================================================ SITE SETTINGS (CMS)
DEFAULT_SETTINGS = {
    "id": "singleton",
    "hero_headline": "Where little minds grow big.",
    "hero_subhead": "Live, online preschool and after-school tutoring for ages 2–10. Tiny classes. Big hearted teachers. The kind of learning kids actually look forward to.",
    "tagline": "Where little minds grow big",
    "about_story": "We were founded by parents, for parents — building a calm, caring online classroom where every child is truly seen. Our promise is simple: small classes, kind gurus, and lessons that feel like play.",
    "contact_email": "littlegurusacademy@gmail.com",
    "contact_phone": "",
    "whatsapp_number": "",
    "business_hours": "Mon–Fri, 7:00 PM – 9:00 PM IST",
    "address": "Gurgaon, Haryana 122004, India",
    "instagram_url": "https://www.instagram.com/littlegurus_in?igsh=bzk5bmVpMXVoY243",
    "youtube_url": "https://youtube.com/@littlegurusacademy?feature=shared",
    "notification_email": "littlegurusacademy@gmail.com",
    "pricing": [
        {"program": "Tiny Tots (2–4)", "sessions": "3 / week · 25 min", "weekly": "₹250", "monthly": "₹1,000", "quarterly": "₹2,700"},
        {"program": "Early Learners (4–6)", "sessions": "5 / week · 35 min", "weekly": "₹250", "monthly": "₹1,000", "quarterly": "₹2,700"},
        {"program": "Primary Prep (6–8)", "sessions": "5 / week · 45 min", "weekly": "₹1,500", "monthly": "₹6,000", "quarterly": "₹16,200"},
        {"program": "After-School (8–10)", "sessions": "5 / week · 60 min", "weekly": "₹2,000", "monthly": "₹8,000", "quarterly": "₹21,600"},
    ],
}


@api.get("/site-settings")
async def get_site_settings():
    doc = await db.site_settings.find_one({"id": "singleton"}, {"_id": 0})
    if not doc:
        await db.site_settings.insert_one(DEFAULT_SETTINGS)
        return DEFAULT_SETTINGS
    return doc


@api.patch("/site-settings", dependencies=[Depends(require_admin)])
async def update_site_settings(payload: SiteSettingsUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    upd["updated_at"] = iso_now()
    await db.site_settings.update_one({"id": "singleton"}, {"$set": upd}, upsert=True)
    return {"ok": True}


# ============================================================ MESSAGES (chat)
@api.post("/messages", status_code=201)
async def create_message(payload: MessageCreate, claims: dict = Depends(lambda: None)):
    # Dual auth: admin OR student
    from fastapi import Request  # noqa
    raise HTTPException(401, "Use /api/messages/student or /api/messages/admin")


@api.post("/messages/student", status_code=201)
async def student_send_message(payload: MessageCreate, claims: dict = Depends(require_student)):
    doc = {
        "id": new_id(),
        "student_id": claims["sub"],
        "from_role": "student",
        "text": payload.text.strip(),
        "read_by_admin": False,
        "read_by_student": True,
        "created_at": iso_now(),
    }
    await db.messages.insert_one(doc)
    return serialize(doc)


@api.post("/messages/admin", status_code=201)
async def admin_send_message(payload: MessageCreate, claims: dict = Depends(require_admin)):
    if not payload.student_id:
        raise HTTPException(400, "student_id required")
    doc = {
        "id": new_id(),
        "student_id": payload.student_id,
        "from_role": "admin",
        "text": payload.text.strip(),
        "read_by_admin": True,
        "read_by_student": False,
        "created_at": iso_now(),
    }
    await db.messages.insert_one(doc)
    return serialize(doc)


@api.get("/messages/student")
async def student_get_messages(claims: dict = Depends(require_student)):
    cursor = db.messages.find({"student_id": claims["sub"]}, {"_id": 0}).sort("created_at", 1)
    msgs = await cursor.to_list(1000)
    # Mark admin messages as read
    await db.messages.update_many(
        {"student_id": claims["sub"], "from_role": "admin", "read_by_student": False},
        {"$set": {"read_by_student": True}},
    )
    return msgs


@api.get("/messages/admin")
async def admin_get_messages(student_id: str = Query(...), claims: dict = Depends(require_admin)):
    cursor = db.messages.find({"student_id": student_id}, {"_id": 0}).sort("created_at", 1)
    msgs = await cursor.to_list(1000)
    await db.messages.update_many(
        {"student_id": student_id, "from_role": "student", "read_by_admin": False},
        {"$set": {"read_by_admin": True}},
    )
    return msgs


@api.get("/messages/admin/threads", dependencies=[Depends(require_admin)])
async def admin_message_threads():
    """Conversation list — last message per student."""
    students = await db.students.find({}, {"_id": 0, "id": 1, "name": 1, "email": 1, "program": 1}).to_list(500)
    out = []
    for s in students:
        last = await db.messages.find_one({"student_id": s["id"]}, {"_id": 0}, sort=[("created_at", -1)])
        unread = await db.messages.count_documents({"student_id": s["id"], "from_role": "student", "read_by_admin": False})
        out.append({**s, "last_message": last, "unread": unread})
    # Sort: unread first, then last activity
    out.sort(key=lambda x: (-x["unread"], -(0 if not x.get("last_message") else 1)))
    return out


# ============================================================ TICKETS
@api.post("/tickets", status_code=201)
async def create_ticket(payload: TicketCreate, claims: dict = Depends(require_student)):
    doc = {
        "id": new_id(),
        "student_id": claims["sub"],
        "student_email": claims.get("email", ""),
        "student_name": claims.get("name", ""),
        "type": payload.type,
        "description": payload.description.strip(),
        "status": "Open",
        "response": "",
        "created_at": iso_now(),
    }
    await db.tickets.insert_one(doc)
    return serialize(doc)


@api.get("/tickets/my")
async def my_tickets(claims: dict = Depends(require_student)):
    cursor = db.tickets.find({"student_id": claims["sub"]}, {"_id": 0}).sort("created_at", -1)
    return await cursor.to_list(200)


@api.get("/tickets", dependencies=[Depends(require_admin)])
async def list_tickets():
    return await list_docs(db.tickets)


@api.patch("/tickets/{tid}", dependencies=[Depends(require_admin)])
async def update_ticket(tid: str, payload: TicketUpdate):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not upd:
        return {"ok": True}
    res = await db.tickets.update_one({"id": tid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


# ============================================================ ADMIN DASHBOARD
@api.get("/admin/stats", dependencies=[Depends(require_admin)])
async def admin_stats():
    from datetime import timedelta
    now = now_utc()
    today_iso = (now - timedelta(days=1)).isoformat()
    week_iso = (now - timedelta(days=7)).isoformat()
    month_iso = (now - timedelta(days=30)).isoformat()

    async def count(col, q=None):
        return await col.count_documents(q or {})

    enq_today = await count(db.enquiries, {"created_at": {"$gte": today_iso}})
    enq_week = await count(db.enquiries, {"created_at": {"$gte": week_iso}})
    enq_month = await count(db.enquiries, {"created_at": {"$gte": month_iso}})
    contact_today = await count(db.contact_messages, {"created_at": {"$gte": today_iso}})

    tours_pending = await count(db.tour_bookings, {"status": "Pending"})
    apps_pending = await count(db.applications, {"status": {"$in": ["Pending", "Under Review"]}})
    students_total = await count(db.students)
    tickets_open = await count(db.tickets, {"status": {"$in": ["Open", "In Progress"]}})
    testimonials_pending = await count(db.testimonials, {"published": False})

    return {
        "enquiries_today": enq_today,
        "enquiries_week": enq_week,
        "enquiries_month": enq_month,
        "contact_today": contact_today,
        "tours_pending": tours_pending,
        "applications_pending": apps_pending,
        "students_total": students_total,
        "tickets_open": tickets_open,
        "testimonials_pending": testimonials_pending,
    }


# ============================================================ STARTUP
@app.on_event("startup")
async def startup():
    # Indexes
    try:
        await db.admin_users.create_index("username", unique=True)
        await db.students.create_index("email", unique=True)
        await db.applications.create_index("reference")
        await db.tour_bookings.create_index("email")
    except Exception as e:
        logger.warning(f"Index creation: {e}")

    # Seed admin
    admin_user = os.environ.get("ADMIN_USERNAME", "admin").lower()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "LGA@2026Admin")
    existing = await db.admin_users.find_one({"username": admin_user})
    if existing is None:
        await db.admin_users.insert_one({
            "id": new_id(),
            "username": admin_user,
            "password_hash": hash_password(admin_pw),
            "created_at": iso_now(),
        })
        logger.info(f"Seeded admin: {admin_user}")
    else:
        # Refresh hash if env password changed
        if not verify_password(admin_pw, existing.get("password_hash", "")):
            await db.admin_users.update_one(
                {"username": admin_user},
                {"$set": {"password_hash": hash_password(admin_pw), "updated_at": iso_now()}},
            )
            logger.info(f"Refreshed admin password for {admin_user}")

    # Ensure site_settings singleton exists
    if not await db.site_settings.find_one({"id": "singleton"}):
        await db.site_settings.insert_one(DEFAULT_SETTINGS)


@app.on_event("shutdown")
async def shutdown():
    client.close()


# ============================================================ MOUNT
app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
