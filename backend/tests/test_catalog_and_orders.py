"""Iteration 2 backend tests: catalog seeding, visibility, order lifecycle."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
API = f"{BASE_URL.rstrip('/')}/api"

ADMIN_USER = "admin"
ADMIN_PASS = "Adurite@2025"


@pytest.fixture(scope="module")
def admin_headers():
    r = requests.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


# ---- Catalog seeding ----
def test_public_items_seeded_48():
    r = requests.get(f"{API}/items", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    # at least 48 visible seeded items
    assert len(items) >= 48, f"expected >=48 items, got {len(items)}"
    for it in items[:3]:
        for k in ["id", "name", "price", "category"]:
            assert k in it
        assert it.get("visible", True) is not False


def test_admin_items_includes_all(admin_headers):
    r = requests.get(f"{API}/admin/items", headers=admin_headers, timeout=15)
    assert r.status_code == 200
    assert len(r.json()) >= 48


# ---- Visibility toggle on seeded item ----
def test_toggle_visibility(admin_headers):
    pub = requests.get(f"{API}/items", timeout=15).json()
    target = pub[0]
    tid = target["id"]
    original_name = target["name"]

    # Hide via PUT
    payload = {
        "name": target["name"], "category": target.get("category", "hat"),
        "rap": target.get("rap", ""), "price": target["price"],
        "image": target.get("image", ""), "trending": target.get("trending", True),
        "visible": False,
    }
    r = requests.put(f"{API}/admin/items/{tid}", headers=admin_headers, json=payload, timeout=15)
    assert r.status_code == 200
    assert r.json()["visible"] is False

    pub_ids = {i["id"] for i in requests.get(f"{API}/items", timeout=15).json()}
    assert tid not in pub_ids, "hidden item still public"

    # Restore
    payload["visible"] = True
    r = requests.put(f"{API}/admin/items/{tid}", headers=admin_headers, json=payload, timeout=15)
    assert r.status_code == 200
    pub_ids2 = {i["id"] for i in requests.get(f"{API}/items", timeout=15).json()}
    assert tid in pub_ids2
    # name preserved
    assert next(i for i in requests.get(f"{API}/items", timeout=15).json() if i["id"] == tid)["name"] == original_name


# ---- Create + edit + delete throwaway item ----
def test_create_edit_delete_item(admin_headers):
    create = {"name": "TEST_Throwaway", "category": "hat", "rap": "R$1", "price": 9.99, "image": "", "trending": False, "visible": True}
    r = requests.post(f"{API}/admin/items", headers=admin_headers, json=create, timeout=15)
    assert r.status_code == 200
    iid = r.json()["id"]

    # Edit
    create["name"] = "TEST_Throwaway_Edited"
    create["price"] = 19.99
    r = requests.put(f"{API}/admin/items/{iid}", headers=admin_headers, json=create, timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "TEST_Throwaway_Edited"
    assert body["price"] == 19.99

    # Verify via public GET
    pub = requests.get(f"{API}/items", timeout=15).json()
    found = next((i for i in pub if i["id"] == iid), None)
    assert found and found["name"] == "TEST_Throwaway_Edited"

    # Delete
    r = requests.delete(f"{API}/admin/items/{iid}", headers=admin_headers, timeout=15)
    assert r.status_code == 200

    pub2_ids = {i["id"] for i in requests.get(f"{API}/items", timeout=15).json()}
    assert iid not in pub2_ids


# ---- Orders lifecycle: awaiting_payment -> confirmed -> delivered ----
def test_order_status_lifecycle(admin_headers):
    payload = {
        "item_id": "TEST_item", "item_name": "TEST_order_item", "item_image": "",
        "total": 10.0, "roblox_username": "TEST_user",
        "payment_method": "Bitcoin (BTC)", "payment_detail": "addr", "crypto_coin": "BTC", "crypto_amount": 0.001,
    }
    r = requests.post(f"{API}/orders", json=payload, timeout=15)
    assert r.status_code == 200
    order = r.json()
    assert order["status"] == "awaiting_payment"
    oid = order["id"]

    # Public GET
    r = requests.get(f"{API}/orders/{oid}", timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "awaiting_payment"

    # Admin PATCH -> confirmed
    r = requests.patch(f"{API}/admin/orders/{oid}", headers=admin_headers, json={"status": "confirmed"}, timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "confirmed"

    r = requests.get(f"{API}/orders/{oid}", timeout=15)
    assert r.json()["status"] == "confirmed"

    # -> delivered
    r = requests.patch(f"{API}/admin/orders/{oid}", headers=admin_headers, json={"status": "delivered"}, timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "delivered"

    r = requests.get(f"{API}/orders/{oid}", timeout=15)
    assert r.json()["status"] == "delivered"


def test_get_order_404():
    r = requests.get(f"{API}/orders/nonexistent_id_xyz", timeout=15)
    assert r.status_code == 404
