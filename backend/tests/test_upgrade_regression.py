"""LGA upgrade regression — admin/student/admissions/CMS end-to-end backend tests.

Covers:
- Health
- Public forms (enquiries / contact / newsletter)
- Admin login + bearer guard
- Tour bookings (public create, admin list/patch)
- Applications (reference LGA-YYYYMMDD-XXXX, status by ref + by email)
- Testimonials (admin create, public published filter)
- Videos (admin create, public free filter)
- Teachers (admin create, public active filter)
- Students (admin create → student login → /student/me)
- Messages (student↔admin)
- Tickets (student create/list, admin list/patch)
- Site settings (public GET, admin PATCH)
"""
import os
import re
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://little-gurus-preview.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_USER = "admin"
ADMIN_PASS = "LGA@2026Admin"
REF_PATTERN = re.compile(r"^LGA-\d{8}-\d{4}$")


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["user"]["role"] == "admin"
    return data["token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ----------------------------- HEALTH
def test_health(session):
    r = session.get(f"{API}/health")
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"


# ----------------------------- PUBLIC FORMS
def test_enquiry_post_201(session):
    r = session.post(f"{API}/enquiries", json={
        "name": "TEST_Parent", "email": "test_parent@example.com",
        "phone": "+919876500000", "child_age": "5",
        "program": "Tiny Tots", "message": "TEST"
    })
    assert r.status_code == 201, r.text
    assert "id" in r.json()


def test_contact_post_201(session):
    r = session.post(f"{API}/contact", json={
        "name": "TEST_Contact", "email": "test_contact@example.com",
        "subject": "Hello", "message": "TEST regression"
    })
    assert r.status_code == 201


def test_newsletter_post_201(session):
    r = session.post(f"{API}/newsletter", json={"email": f"test_news_{uuid.uuid4().hex[:6]}@example.com"})
    assert r.status_code == 201


# ----------------------------- ADMIN AUTH
def test_admin_login_wrong_password(session):
    r = session.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": "wrong"})
    assert r.status_code == 401


def test_admin_endpoint_requires_token(session):
    r = session.get(f"{API}/enquiries")  # admin-protected
    assert r.status_code == 401


def test_admin_list_enquiries(session, admin_headers):
    r = session.get(f"{API}/enquiries", headers=admin_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_stats(session, admin_headers):
    r = session.get(f"{API}/admin/stats", headers=admin_headers)
    assert r.status_code == 200
    body = r.json()
    for k in ["enquiries_today", "tours_pending", "applications_pending", "students_total", "tickets_open"]:
        assert k in body


# ----------------------------- TOUR BOOKINGS
def test_tour_booking_flow(session, admin_headers):
    payload = {
        "parent_name": "TEST_Tour Parent", "child_name": "Kid", "child_age": "6",
        "email": "test_tour@example.com", "phone": "+919876500001",
        "preferred_date": "2026-02-10", "preferred_slot": "7:00 PM IST",
        "program": "Primary Prep", "message": "TEST"
    }
    r = session.post(f"{API}/tour-bookings", json=payload)
    assert r.status_code == 201, r.text
    bid = r.json()["id"]

    # listing requires admin
    r_no = session.get(f"{API}/tour-bookings")
    assert r_no.status_code == 401

    r_l = session.get(f"{API}/tour-bookings", headers=admin_headers)
    assert r_l.status_code == 200
    assert any(b["id"] == bid for b in r_l.json())

    # PATCH status
    rp = session.patch(f"{API}/tour-bookings/{bid}", headers=admin_headers, json={"status": "Confirmed"})
    assert rp.status_code == 200


# ----------------------------- APPLICATIONS
@pytest.fixture(scope="module")
def created_application(session):
    payload = {
        "parent_name": "TEST_App Parent", "child_name": "Tiny",
        "child_dob": "2020-06-15", "child_age": "5",
        "gender": "F", "email": "test_app@example.com", "phone": "+919876500002",
        "city": "Gurgaon", "program": "Early Learners", "source": "website", "notes": "TEST"
    }
    r = session.post(f"{API}/applications", json=payload)
    assert r.status_code == 201, r.text
    body = r.json()
    assert REF_PATTERN.match(body["reference"]), f"Bad ref: {body['reference']}"
    return body


def test_application_status_by_ref(session, created_application):
    ref = created_application["reference"]
    r = session.get(f"{API}/application-status", params={"ref": ref})
    assert r.status_code == 200
    apps = r.json()["applications"]
    assert any(a["reference"] == ref for a in apps)
    # admin_notes should be excluded
    assert all("admin_notes" not in a for a in apps)


def test_application_status_by_email(session):
    r = session.get(f"{API}/application-status", params={"email": "test_app@example.com"})
    assert r.status_code == 200
    assert len(r.json()["applications"]) >= 1


def test_application_status_404(session):
    r = session.get(f"{API}/application-status", params={"ref": "LGA-20990101-9999"})
    assert r.status_code == 404


def test_application_admin_list(session, admin_headers, created_application):
    r = session.get(f"{API}/applications", headers=admin_headers)
    assert r.status_code == 200
    assert any(a["reference"] == created_application["reference"] for a in r.json())


# ----------------------------- TESTIMONIALS
@pytest.fixture(scope="module")
def created_testimonial(session, admin_headers):
    r = session.post(f"{API}/testimonials", headers=admin_headers, json={
        "parent_name": "TEST_Reviewer",
        "child_info": "Age 5, Tiny Tots",
        "text": "TEST testimonial — wonderful classes!",
        "rating": 5, "published": True
    })
    assert r.status_code == 201, r.text
    return r.json()


def test_testimonial_requires_admin(session):
    r = session.post(f"{API}/testimonials", json={"parent_name": "x", "text": "y"})
    assert r.status_code == 401


def test_testimonial_public_published(session, created_testimonial):
    r = session.get(f"{API}/testimonials", params={"published": "true"})
    assert r.status_code == 200
    items = r.json()
    assert any(t["id"] == created_testimonial["id"] for t in items)
    # all returned must be published
    assert all(t.get("published") is True for t in items)


# ----------------------------- VIDEOS
@pytest.fixture(scope="module")
def created_video(session, admin_headers):
    r = session.post(f"{API}/videos", headers=admin_headers, json={
        "title": "TEST_FreeVideo",
        "description": "Sample",
        "subject": "Math", "age_group": "4-6",
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "thumbnail_url": "", "duration": "5:00", "is_free": True,
    })
    assert r.status_code == 201, r.text
    return r.json()


def test_video_requires_admin(session):
    r = session.post(f"{API}/videos", json={"title": "x", "subject": "Math", "age_group": "All", "video_url": "u"})
    assert r.status_code == 401


def test_video_public_free(session, created_video):
    r = session.get(f"{API}/videos", params={"free": "true"})
    assert r.status_code == 200
    items = r.json()
    assert any(v["id"] == created_video["id"] for v in items)
    assert all(v.get("is_free") for v in items)


# ----------------------------- TEACHERS
@pytest.fixture(scope="module")
def created_teacher(session, admin_headers):
    r = session.post(f"{API}/teachers", headers=admin_headers, json={
        "name": "TEST_Guru Anita", "role": "English & Phonics",
        "bio": "TEST bio", "qualifications": "M.A. English",
        "photo_url": "", "joining_date": "2024-01-01",
        "active": True, "order": 10
    })
    assert r.status_code == 201, r.text
    return r.json()


def test_teacher_public_active(session, created_teacher):
    r = session.get(f"{API}/teachers", params={"active": "true"})
    assert r.status_code == 200
    items = r.json()
    assert any(t["id"] == created_teacher["id"] for t in items)
    assert all(t.get("active") for t in items)


# ----------------------------- STUDENTS + LOGIN
@pytest.fixture(scope="module")
def student_account(session, admin_headers):
    email = f"test_student_{uuid.uuid4().hex[:6]}@example.com"
    pw = "Testpass@123"
    r = session.post(f"{API}/students", headers=admin_headers, json={
        "name": "TEST_Student Kid",
        "parent_name": "TEST_Parent",
        "parent_phone": "+919876500005",
        "email": email,
        "password": pw,
        "program": "Primary Prep",
        "age_group": "6-8",
        "status": "Active",
    })
    assert r.status_code == 201, r.text
    body = r.json()
    assert "password_hash" not in body
    return {"email": email, "password": pw, "id": body["id"]}


@pytest.fixture(scope="module")
def student_token(session, student_account):
    r = session.post(f"{API}/student/login", json={
        "email": student_account["email"], "password": student_account["password"]
    })
    assert r.status_code == 200, r.text
    assert r.json()["user"]["role"] == "student"
    return r.json()["token"]


@pytest.fixture(scope="module")
def student_headers(student_token):
    return {"Authorization": f"Bearer {student_token}", "Content-Type": "application/json"}


def test_student_login_bad_creds(session):
    r = session.post(f"{API}/student/login", json={"email": "no@x.com", "password": "bad"})
    assert r.status_code == 401


def test_student_me(session, student_headers, student_account):
    r = session.get(f"{API}/student/me", headers=student_headers)
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == student_account["email"]
    assert "password_hash" not in body


def test_student_cannot_call_admin(session, student_headers):
    r = session.get(f"{API}/enquiries", headers=student_headers)
    assert r.status_code == 403


def test_admin_cannot_call_student_only(session, admin_headers):
    r = session.get(f"{API}/student/me", headers=admin_headers)
    assert r.status_code == 403


# ----------------------------- MESSAGES
def test_messages_bidirectional(session, student_headers, admin_headers, student_account):
    sid = student_account["id"]
    # student -> admin
    r1 = session.post(f"{API}/messages/student", headers=student_headers, json={"text": "TEST hi from student"})
    assert r1.status_code == 201
    # admin -> student
    r2 = session.post(f"{API}/messages/admin", headers=admin_headers, json={"text": "TEST reply from admin", "student_id": sid})
    assert r2.status_code == 201
    # admin reads
    ra = session.get(f"{API}/messages/admin", headers=admin_headers, params={"student_id": sid})
    assert ra.status_code == 200
    texts = [m["text"] for m in ra.json()]
    assert "TEST hi from student" in texts and "TEST reply from admin" in texts
    # student reads
    rs = session.get(f"{API}/messages/student", headers=student_headers)
    assert rs.status_code == 200
    s_texts = [m["text"] for m in rs.json()]
    assert "TEST hi from student" in s_texts and "TEST reply from admin" in s_texts


def test_admin_message_threads(session, admin_headers):
    r = session.get(f"{API}/messages/admin/threads", headers=admin_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_send_message_requires_student_id(session, admin_headers):
    r = session.post(f"{API}/messages/admin", headers=admin_headers, json={"text": "no id"})
    assert r.status_code == 400


# ----------------------------- TICKETS
def test_ticket_flow(session, student_headers, admin_headers):
    # student creates
    r = session.post(f"{API}/tickets", headers=student_headers, json={
        "type": "Technical Issue", "description": "TEST ticket — please ignore"
    })
    assert r.status_code == 201
    tid = r.json()["id"]
    # student lists own
    rm = session.get(f"{API}/tickets/my", headers=student_headers)
    assert rm.status_code == 200
    assert any(t["id"] == tid for t in rm.json())
    # admin lists
    ra = session.get(f"{API}/tickets", headers=admin_headers)
    assert ra.status_code == 200
    assert any(t["id"] == tid for t in ra.json())
    # admin patches
    rp = session.patch(f"{API}/tickets/{tid}", headers=admin_headers,
                       json={"status": "Resolved", "response": "Fixed"})
    assert rp.status_code == 200


# ----------------------------- SITE SETTINGS
def test_site_settings_public(session):
    r = session.get(f"{API}/site-settings")
    assert r.status_code == 200
    body = r.json()
    assert "pricing" in body and isinstance(body["pricing"], list)
    # Verify upgraded pricing for Primary Prep & After-School
    by_prog = {p["program"]: p for p in body["pricing"]}
    pp = next((v for k, v in by_prog.items() if "Primary Prep" in k), None)
    asp = next((v for k, v in by_prog.items() if "After-School" in k), None)
    assert pp and pp["weekly"] == "₹1,500" and pp["monthly"] == "₹6,000" and pp["quarterly"] == "₹16,200"
    assert asp and asp["weekly"] == "₹2,000" and asp["monthly"] == "₹8,000" and asp["quarterly"] == "₹21,600"


def test_site_settings_patch_requires_admin(session):
    r = session.patch(f"{API}/site-settings", json={"tagline": "x"})
    assert r.status_code == 401


def test_site_settings_patch_admin(session, admin_headers):
    r = session.patch(f"{API}/site-settings", headers=admin_headers, json={"tagline": "Where little minds grow big"})
    assert r.status_code == 200
