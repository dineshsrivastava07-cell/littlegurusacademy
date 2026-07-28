"""Regression tests for token-expiry bug fix and site-settings ObjectId fix."""
import os
import time
import jwt as pyjwt
import pytest
import requests
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://littlegurusacademy.vercel.app").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_USER = "admin"
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "LGA@2026Admin")


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ---------- Admin login + JWT_EXPIRE_HOURS ~ 72h ----------
def test_admin_login_returns_valid_jwt_with_72h_expiry(admin_token):
    # Decode WITHOUT verifying signature to inspect exp
    payload = pyjwt.decode(admin_token, options={"verify_signature": False})
    assert payload["role"] == "admin"
    exp = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    iat = datetime.fromtimestamp(payload["iat"], tz=timezone.utc)
    lifetime_hours = (exp - iat).total_seconds() / 3600
    # Expected 72h (spec) — allow a little slack
    assert 71.5 <= lifetime_hours <= 72.5, f"lifetime={lifetime_hours}h, expected ~72"


def test_admin_stats_with_valid_token(admin_token):
    r = requests.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, dict)


# ---------- 401 on invalid / missing token ----------
@pytest.mark.parametrize("endpoint", ["/admin/stats", "/enquiries", "/applications"])
def test_protected_endpoint_401_with_invalid_token(endpoint):
    r = requests.get(f"{API}{endpoint}", headers={"Authorization": "Bearer invalid.token.here"}, timeout=15)
    assert r.status_code == 401, f"{endpoint} → {r.status_code} {r.text}"


@pytest.mark.parametrize("endpoint", ["/admin/stats", "/enquiries", "/applications"])
def test_protected_endpoint_401_with_missing_token(endpoint):
    r = requests.get(f"{API}{endpoint}", timeout=15)
    assert r.status_code == 401


def test_protected_endpoint_401_with_expired_token():
    """Forge an expired token using the real JWT_SECRET from backend env if available."""
    secret = os.environ.get("JWT_SECRET")
    if secret:
        payload = {
            "sub": "admin",
            "role": "admin",
            "iat": datetime.now(timezone.utc) - timedelta(hours=2),
            "exp": datetime.now(timezone.utc) - timedelta(hours=1),
        }
        token = pyjwt.encode(payload, secret, algorithm="HS256")
    else:
        token = "expired.fake.token"
    r = requests.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {token}"}, timeout=15)
    assert r.status_code == 401


# ---------- site-settings ObjectId regression ----------
def test_site_settings_no_objectid_and_correct_pricing():
    r = requests.get(f"{API}/site-settings", timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "_id" not in data, "site-settings response must not contain mongo _id"
    assert "pricing" in data, "pricing key missing"
    pricing = data["pricing"]
    flat = str(pricing)
    assert "Primary Prep" in flat
    assert "After-School" in flat or "After School" in flat
    assert "6,000" in flat or "6000" in flat, "Primary Prep monthly Rs.6,000 not found"
    assert "8,000" in flat or "8000" in flat, "After-School monthly Rs.8,000 not found"


# ---------- Public endpoints untouched by auth ----------
def test_public_testimonials_no_auth_required():
    r = requests.get(f"{API}/testimonials", params={"published": "true"}, timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_health():
    r = requests.get(f"{API}/health", timeout=15)
    assert r.status_code == 200


# ---------- Student LMS parallel 401 behaviour ----------
def test_student_me_401_with_invalid_token():
    r = requests.get(f"{API}/student/me", headers={"Authorization": "Bearer invalid.token.here"}, timeout=15)
    assert r.status_code == 401
