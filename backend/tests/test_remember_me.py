"""Tests for 'Remember me' JWT lifetime + regressions."""
import os
import time
import pytest
import requests
import jwt as pyjwt
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fallback to frontend .env
    fe_env = Path(__file__).parent.parent.parent / "frontend" / ".env"
    for line in fe_env.read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = os.environ.get("JWT_ALGO", "HS256")

ADMIN_USER = "admin"
ADMIN_PW = "LGA@2026Admin"


def _decode(tok):
    return pyjwt.decode(tok, JWT_SECRET, algorithms=[JWT_ALGO])


def _lifetime_hours(tok):
    p = _decode(tok)
    return (p["exp"] - p["iat"]) / 3600.0


# ---------- Admin login remember ----------
class TestAdminRemember:
    def test_login_default(self):
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"username": ADMIN_USER, "password": ADMIN_PW})
        assert r.status_code == 200, r.text
        tok = r.json()["token"]
        hrs = _lifetime_hours(tok)
        # default JWT_EXPIRE_HOURS may be 12 or 72; assert it's clearly not 30d
        assert hrs < 24 * 29, f"default lifetime {hrs}h should be < 29 days"
        assert hrs >= 1, f"lifetime {hrs}h too short"

    def test_login_remember_true(self):
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"username": ADMIN_USER, "password": ADMIN_PW, "remember": True})
        assert r.status_code == 200, r.text
        tok = r.json()["token"]
        hrs = _lifetime_hours(tok)
        assert 700 <= hrs <= 730, f"remember lifetime {hrs}h not ~720h"

    def test_login_remember_false(self):
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"username": ADMIN_USER, "password": ADMIN_PW, "remember": False})
        assert r.status_code == 200
        hrs = _lifetime_hours(r.json()["token"])
        assert hrs < 24 * 29

    def test_invalid_creds(self):
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"username": ADMIN_USER, "password": "wrong"})
        assert r.status_code == 401


# ---------- Protected endpoints regression ----------
class TestAdminProtected:
    @pytest.fixture(scope="class")
    def admin_token(self):
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"username": ADMIN_USER, "password": ADMIN_PW})
        return r.json()["token"]

    def test_stats_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/stats")
        assert r.status_code == 401

    def test_stats_invalid_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/stats",
                         headers={"Authorization": "Bearer bad.token.here"})
        assert r.status_code == 401

    def test_stats_valid(self, admin_token):
        r = requests.get(f"{BASE_URL}/api/admin/stats",
                         headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        data = r.json()
        assert "students_total" in data
        assert "enquiries_today" in data

    def test_site_settings_no_raw_id(self):
        r = requests.get(f"{BASE_URL}/api/site-settings")
        assert r.status_code == 200
        data = r.json()
        assert "_id" not in data
        assert "pricing" in data
        assert isinstance(data["pricing"], list) and len(data["pricing"]) > 0


# ---------- Student login remember ----------
TEST_STUDENT_EMAIL = "test_remember_student@example.com"
TEST_STUDENT_PW = "student123"


class TestStudentRemember:
    @pytest.fixture(scope="class")
    def admin_token(self):
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"username": ADMIN_USER, "password": ADMIN_PW})
        return r.json()["token"]

    @pytest.fixture(scope="class")
    def student_created(self, admin_token):
        # Try create; ignore 409
        r = requests.post(f"{BASE_URL}/api/students",
                          headers={"Authorization": f"Bearer {admin_token}"},
                          json={
                              "name": "Test Remember",
                              "email": TEST_STUDENT_EMAIL,
                              "password": TEST_STUDENT_PW,
                              "program": "Tiny Tots",
                              "status": "Active",
                          })
        assert r.status_code in (201, 409), r.text
        return True

    def test_student_login_default(self, student_created):
        r = requests.post(f"{BASE_URL}/api/student/login",
                          json={"email": TEST_STUDENT_EMAIL, "password": TEST_STUDENT_PW})
        assert r.status_code == 200, r.text
        hrs = _lifetime_hours(r.json()["token"])
        assert hrs < 24 * 29

    def test_student_login_remember(self, student_created):
        r = requests.post(f"{BASE_URL}/api/student/login",
                          json={"email": TEST_STUDENT_EMAIL, "password": TEST_STUDENT_PW, "remember": True})
        assert r.status_code == 200, r.text
        hrs = _lifetime_hours(r.json()["token"])
        assert 700 <= hrs <= 730, f"remember lifetime {hrs}h not ~720h"
