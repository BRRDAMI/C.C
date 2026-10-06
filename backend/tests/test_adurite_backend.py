"""Adurite backend API tests - payment methods, rates, orders."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
API = f"{BASE_URL.rstrip('/')}/api"

ADMIN_USER = "admin"
ADMIN_PASS = "Adurite@2025"
TINY_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---- Payment Methods ----
def test_public_payment_methods_shape():
    r = requests.get(f"{API}/payment-methods", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 1
    for m in data:
        for k in ["id", "label", "coin", "type", "detail", "qr_image", "enabled"]:
            assert k in m, f"missing {k}"
        assert m["enabled"] is True


def test_admin_payment_methods_has_all_four(admin_headers):
    r = requests.get(f"{API}/admin/payment-methods", headers=admin_headers, timeout=15)
    assert r.status_code == 200
    ids = {m["id"] for m in r.json()}
    assert {"btc", "ltc", "eth", "paypal"}.issubset(ids)


# ---- Rates ----
def test_rates_endpoint():
    r = requests.get(f"{API}/rates", timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    for k in ["BTC", "LTC", "ETH", "updated_at"]:
        assert k in data
    for k in ["BTC", "LTC", "ETH"]:
        assert isinstance(data[k], (int, float)) and data[k] > 0


# ---- Admin flow: disable eth + set ltc QR, verify, re-enable ----
def test_admin_update_payment_methods_flow(admin_headers):
    # fetch current
    r = requests.get(f"{API}/admin/payment-methods", headers=admin_headers, timeout=15)
    assert r.status_code == 200
    methods = r.json()
    orig = {m["id"]: dict(m) for m in methods}

    for m in methods:
        if m["id"] == "ltc":
            m["qr_image"] = TINY_PNG
            m["detail"] = m.get("detail") or "ltc1q0g0zxazr6ghzxlpamazq28ksh8ujdu0w4e78sl"
        if m["id"] == "eth":
            m["enabled"] = False

    r = requests.put(f"{API}/admin/payment-methods", headers=admin_headers, json={"methods": methods}, timeout=15)
    assert r.status_code == 200, r.text

    pub = requests.get(f"{API}/payment-methods", timeout=15).json()
    pub_ids = {m["id"] for m in pub}
    assert "eth" not in pub_ids, "ETH should be hidden"
    ltc = next((m for m in pub if m["id"] == "ltc"), None)
    assert ltc and ltc["qr_image"] == TINY_PNG

    # restore
    restored = list(orig.values())
    for m in restored:
        if m["id"] == "ltc":
            m["qr_image"] = TINY_PNG  # keep QR for frontend tests
    r = requests.put(f"{API}/admin/payment-methods", headers=admin_headers, json={"methods": restored}, timeout=15)
    assert r.status_code == 200
    pub2 = requests.get(f"{API}/payment-methods", timeout=15).json()
    assert "eth" in {m["id"] for m in pub2}


# ---- Orders ----
def test_create_order_with_crypto_fields(admin_headers):
    payload = {
        "item_id": "1029025",
        "item_name": "TEST_The Classic Fedora",
        "item_image": "",
        "total": 1972.0,
        "roblox_username": "TEST_builderman",
        "payment_method": "Litecoin (LTC)",
        "payment_detail": "ltc1q0g0zxazr6ghzxlpamazq28ksh8ujdu0w4e78sl",
        "crypto_coin": "LTC",
        "crypto_amount": 28.43,
    }
    r = requests.post(f"{API}/orders", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["crypto_coin"] == "LTC"
    assert created["crypto_amount"] == 28.43
    oid = created["id"]

    r = requests.get(f"{API}/admin/orders", headers=admin_headers, timeout=15)
    assert r.status_code == 200
    found = next((o for o in r.json() if o["id"] == oid), None)
    assert found is not None
    assert found["crypto_coin"] == "LTC"
    assert found["crypto_amount"] == 28.43
