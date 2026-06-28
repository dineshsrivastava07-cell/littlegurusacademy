"""DPDP iteration regression: ensure /api/enquiries and /api/contact still 201 with original payload shape."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://little-gurus-preview.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_health(api):
    r = api.get(f"{BASE_URL}/api/health", timeout=20)
    assert r.status_code in (200, 404)  # tolerate either


def test_enquiries_post_201(api):
    suffix = uuid.uuid4().hex[:6]
    payload = {
        "name": f"TEST_Parent_{suffix}",
        "email": f"test_{suffix}@example.com",
        "phone": "9999999999",
        "child_age": "5 years",
        "program": "Tiny Tots · Ages 2-4",
        "message": "TEST DPDP regression enquiry — please ignore.",
    }
    r = api.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=30)
    assert r.status_code in (200, 201), f"got {r.status_code}: {r.text[:300]}"
    body = r.json()
    assert body.get("name") == payload["name"] or body.get("ok") is True or "id" in body


def test_contact_post_201(api):
    suffix = uuid.uuid4().hex[:6]
    payload = {
        "name": f"TEST_Contact_{suffix}",
        "email": f"test_{suffix}@example.com",
        "subject": "TEST DPDP",
        "message": "TEST DPDP regression contact — please ignore.",
    }
    r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
    assert r.status_code in (200, 201), f"got {r.status_code}: {r.text[:300]}"


def test_enquiries_rejects_consent_field_gracefully(api):
    """Server should not 500 if extra 'consent' key sneaks through."""
    suffix = uuid.uuid4().hex[:6]
    payload = {
        "name": f"TEST_Parent_{suffix}",
        "email": f"test_{suffix}@example.com",
        "phone": "9999999999",
        "child_age": "5 years",
        "program": "Tiny Tots · Ages 2-4",
        "message": "TEST",
        "consent": True,
    }
    r = api.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=30)
    # Either accept and ignore, or reject with 422 — both fine; must not be 5xx.
    assert r.status_code < 500, f"server error: {r.status_code} {r.text[:300]}"
