#!/usr/bin/env python3
"""
Comprehensive backend API test for Adurite clone
Tests all public and admin endpoints with proper authentication
"""
import requests
import json
import sys
from typing import Optional

# Configuration
BASE_URL = "https://adurite-mirror.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "Adurite@2025"

# Test state
admin_token: Optional[str] = None
created_item_id: Optional[str] = None
created_order_id: Optional[str] = None

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def log_test(name: str):
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST: {name}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")

def log_success(msg: str):
    print(f"{GREEN}✓ {msg}{RESET}")

def log_error(msg: str):
    print(f"{RED}✗ {msg}{RESET}")

def log_info(msg: str):
    print(f"{YELLOW}ℹ {msg}{RESET}")

def test_public_root():
    """Test GET /api/"""
    log_test("Public Root Endpoint")
    try:
        resp = requests.get(f"{BASE_URL}/")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert "message" in data, "Response should contain 'message' field"
        log_success(f"GET / returned: {data}")
        return True
    except Exception as e:
        log_error(f"GET / failed: {e}")
        return False

def test_public_items():
    """Test GET /api/items"""
    log_test("Public Items List")
    try:
        resp = requests.get(f"{BASE_URL}/items")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        items = resp.json()
        assert isinstance(items, list), "Response should be a list"
        log_success(f"GET /items returned {len(items)} items")
        return True
    except Exception as e:
        log_error(f"GET /items failed: {e}")
        return False

def test_public_payment_methods():
    """Test GET /api/payment-methods - should return default seeded methods"""
    log_test("Public Payment Methods")
    try:
        resp = requests.get(f"{BASE_URL}/payment-methods")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        methods = resp.json()
        assert isinstance(methods, list), "Response should be a list"
        assert len(methods) >= 4, "Should have at least 4 default payment methods"
        
        # Check for default methods
        method_ids = [m.get("id") for m in methods]
        expected = ["paypal", "btc", "eth", "ltc"]
        for exp_id in expected:
            assert exp_id in method_ids, f"Missing default payment method: {exp_id}"
        
        log_success(f"GET /payment-methods returned {len(methods)} methods: {method_ids}")
        return True
    except Exception as e:
        log_error(f"GET /payment-methods failed: {e}")
        return False

def test_create_order():
    """Test POST /api/orders"""
    log_test("Create Order (Public)")
    global created_order_id
    try:
        order_data = {
            "item_id": "test_item_123",
            "item_name": "Dominus Empyreus",
            "item_image": "https://example.com/dominus.png",
            "total": 299.99,
            "roblox_username": "RobloxPlayer2025",
            "payment_method": "paypal",
            "payment_detail": "user@example.com"
        }
        resp = requests.post(f"{BASE_URL}/orders", json=order_data)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        order = resp.json()
        
        # Verify order structure
        assert "id" in order, "Order should have 'id' field"
        assert order["id"].startswith("ord_"), f"Order ID should start with 'ord_', got {order['id']}"
        assert order["status"] == "pending", f"Order status should be 'pending', got {order['status']}"
        assert "created_at" in order, "Order should have 'created_at' field"
        assert order["item_name"] == "Dominus Empyreus", "Item name mismatch"
        assert order["roblox_username"] == "RobloxPlayer2025", "Roblox username mismatch"
        
        created_order_id = order["id"]
        log_success(f"POST /orders created order: {created_order_id}")
        return True
    except Exception as e:
        log_error(f"POST /orders failed: {e}")
        return False

def test_list_orders():
    """Test GET /api/orders"""
    log_test("List Orders (Public)")
    try:
        resp = requests.get(f"{BASE_URL}/orders")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        orders = resp.json()
        assert isinstance(orders, list), "Response should be a list"
        
        if created_order_id:
            order_ids = [o.get("id") for o in orders]
            assert created_order_id in order_ids, f"Created order {created_order_id} not found in list"
            log_success(f"GET /orders returned {len(orders)} orders, including created order")
        else:
            log_success(f"GET /orders returned {len(orders)} orders")
        return True
    except Exception as e:
        log_error(f"GET /orders failed: {e}")
        return False

def test_admin_login_wrong_password():
    """Test POST /api/admin/login with wrong password"""
    log_test("Admin Login - Wrong Password")
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", json={
            "username": ADMIN_USERNAME,
            "password": "WrongPassword123"
        })
        assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
        log_success("POST /admin/login correctly rejected wrong password with 401")
        return True
    except Exception as e:
        log_error(f"Admin login wrong password test failed: {e}")
        return False

def test_admin_login_correct():
    """Test POST /api/admin/login with correct credentials"""
    log_test("Admin Login - Correct Credentials")
    global admin_token
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert "token" in data, "Response should contain 'token' field"
        admin_token = data["token"]
        log_success(f"POST /admin/login returned token: {admin_token[:20]}...")
        return True
    except Exception as e:
        log_error(f"Admin login failed: {e}")
        return False

def test_admin_me_no_token():
    """Test GET /api/admin/me without token"""
    log_test("Admin Me - No Token")
    try:
        resp = requests.get(f"{BASE_URL}/admin/me")
        assert resp.status_code in [401, 403], f"Expected 401/403, got {resp.status_code}"
        log_success(f"GET /admin/me correctly rejected request without token ({resp.status_code})")
        return True
    except Exception as e:
        log_error(f"Admin me no token test failed: {e}")
        return False

def test_admin_me_with_token():
    """Test GET /api/admin/me with valid token"""
    log_test("Admin Me - With Valid Token")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.get(f"{BASE_URL}/admin/me", headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert data.get("ok") == True, "Response should have ok: true"
        log_success("GET /admin/me returned {ok: true}")
        return True
    except Exception as e:
        log_error(f"Admin me with token failed: {e}")
        return False

def test_admin_create_item():
    """Test POST /api/admin/items"""
    log_test("Admin Create Item")
    global created_item_id
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        item_data = {
            "name": "Valkyrie Helm",
            "category": "hat",
            "rap": "50,000",
            "price": 149.99,
            "image": "https://example.com/valkyrie.png",
            "trending": True
        }
        resp = requests.post(f"{BASE_URL}/admin/items", json=item_data, headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        item = resp.json()
        
        # Verify item structure
        assert "id" in item, "Item should have 'id' field"
        assert item["id"].startswith("adm_"), f"Item ID should start with 'adm_', got {item['id']}"
        assert item.get("admin") == True, "Item should have admin: true"
        assert item["name"] == "Valkyrie Helm", "Item name mismatch"
        assert item["price"] == 149.99, "Item price mismatch"
        
        created_item_id = item["id"]
        log_success(f"POST /admin/items created item: {created_item_id}")
        return True
    except Exception as e:
        log_error(f"Admin create item failed: {e}")
        return False

def test_admin_list_items():
    """Test GET /api/admin/items"""
    log_test("Admin List Items")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.get(f"{BASE_URL}/admin/items", headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        items = resp.json()
        assert isinstance(items, list), "Response should be a list"
        
        if created_item_id:
            item_ids = [i.get("id") for i in items]
            assert created_item_id in item_ids, f"Created item {created_item_id} not found in list"
            log_success(f"GET /admin/items returned {len(items)} items, including created item")
        else:
            log_success(f"GET /admin/items returned {len(items)} items")
        return True
    except Exception as e:
        log_error(f"Admin list items failed: {e}")
        return False

def test_public_items_includes_admin_item():
    """Verify GET /api/items includes admin-created item"""
    log_test("Public Items Includes Admin Item")
    try:
        resp = requests.get(f"{BASE_URL}/items")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        items = resp.json()
        
        if created_item_id:
            item_ids = [i.get("id") for i in items]
            assert created_item_id in item_ids, f"Admin item {created_item_id} not visible in public items"
            log_success(f"Public /items includes admin-created item {created_item_id}")
        else:
            log_info("No admin item created yet to verify")
        return True
    except Exception as e:
        log_error(f"Public items check failed: {e}")
        return False

def test_admin_update_item():
    """Test PUT /api/admin/items/{id}"""
    log_test("Admin Update Item")
    try:
        if not created_item_id:
            log_info("No item to update, skipping")
            return True
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        update_data = {
            "name": "Valkyrie Helm (Updated)",
            "category": "hat",
            "rap": "55,000",
            "price": 159.99,
            "image": "https://example.com/valkyrie.png",
            "trending": True
        }
        resp = requests.put(f"{BASE_URL}/admin/items/{created_item_id}", json=update_data, headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        item = resp.json()
        
        assert item["name"] == "Valkyrie Helm (Updated)", "Item name not updated"
        assert item["price"] == 159.99, "Item price not updated"
        
        log_success(f"PUT /admin/items/{created_item_id} updated successfully")
        return True
    except Exception as e:
        log_error(f"Admin update item failed: {e}")
        return False

def test_admin_update_nonexistent_item():
    """Test PUT /api/admin/items/{id} with non-existent ID"""
    log_test("Admin Update Non-existent Item")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        update_data = {
            "name": "Ghost Item",
            "category": "hat",
            "rap": "0",
            "price": 0,
            "image": "",
            "trending": False
        }
        resp = requests.put(f"{BASE_URL}/admin/items/nonexistent_id_999", json=update_data, headers=headers)
        assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
        log_success("PUT /admin/items/nonexistent correctly returned 404")
        return True
    except Exception as e:
        log_error(f"Admin update nonexistent item test failed: {e}")
        return False

def test_admin_delete_item():
    """Test DELETE /api/admin/items/{id}"""
    log_test("Admin Delete Item")
    try:
        if not created_item_id:
            log_info("No item to delete, skipping")
            return True
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.delete(f"{BASE_URL}/admin/items/{created_item_id}", headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert data.get("ok") == True, "Response should have ok: true"
        
        log_success(f"DELETE /admin/items/{created_item_id} successful")
        
        # Verify item is removed from public list
        resp = requests.get(f"{BASE_URL}/items")
        items = resp.json()
        item_ids = [i.get("id") for i in items]
        assert created_item_id not in item_ids, f"Deleted item {created_item_id} still in public items"
        log_success(f"Verified item {created_item_id} removed from public items")
        
        return True
    except Exception as e:
        log_error(f"Admin delete item failed: {e}")
        return False

def test_admin_delete_nonexistent_item():
    """Test DELETE /api/admin/items/{id} with non-existent ID"""
    log_test("Admin Delete Non-existent Item")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.delete(f"{BASE_URL}/admin/items/nonexistent_id_999", headers=headers)
        assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
        log_success("DELETE /admin/items/nonexistent correctly returned 404")
        return True
    except Exception as e:
        log_error(f"Admin delete nonexistent item test failed: {e}")
        return False

def test_admin_list_orders():
    """Test GET /api/admin/orders"""
    log_test("Admin List Orders")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        orders = resp.json()
        assert isinstance(orders, list), "Response should be a list"
        log_success(f"GET /admin/orders returned {len(orders)} orders")
        return True
    except Exception as e:
        log_error(f"Admin list orders failed: {e}")
        return False

def test_admin_update_order_status():
    """Test PATCH /api/admin/orders/{id}"""
    log_test("Admin Update Order Status")
    try:
        if not created_order_id:
            log_info("No order to update, skipping")
            return True
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.patch(f"{BASE_URL}/admin/orders/{created_order_id}", 
                            json={"status": "completed"}, 
                            headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        order = resp.json()
        assert order["status"] == "completed", f"Order status should be 'completed', got {order['status']}"
        
        log_success(f"PATCH /admin/orders/{created_order_id} updated status to 'completed'")
        return True
    except Exception as e:
        log_error(f"Admin update order status failed: {e}")
        return False

def test_admin_update_nonexistent_order():
    """Test PATCH /api/admin/orders/{id} with non-existent ID"""
    log_test("Admin Update Non-existent Order")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.patch(f"{BASE_URL}/admin/orders/nonexistent_ord_999", 
                            json={"status": "completed"}, 
                            headers=headers)
        assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
        log_success("PATCH /admin/orders/nonexistent correctly returned 404")
        return True
    except Exception as e:
        log_error(f"Admin update nonexistent order test failed: {e}")
        return False

def test_admin_get_payment_methods():
    """Test GET /api/admin/payment-methods"""
    log_test("Admin Get Payment Methods")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        resp = requests.get(f"{BASE_URL}/admin/payment-methods", headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        methods = resp.json()
        assert isinstance(methods, list), "Response should be a list"
        log_success(f"GET /admin/payment-methods returned {len(methods)} methods")
        return True
    except Exception as e:
        log_error(f"Admin get payment methods failed: {e}")
        return False

def test_admin_save_payment_methods():
    """Test PUT /api/admin/payment-methods"""
    log_test("Admin Save Payment Methods")
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        custom_methods = [
            {
                "id": "custom_paypal",
                "label": "Custom PayPal",
                "type": "paypal",
                "detail": "custom@adurite.com",
                "instructions": "Send payment to custom account"
            },
            {
                "id": "custom_btc",
                "label": "Custom Bitcoin",
                "type": "crypto",
                "detail": "bc1qcustomaddress123456789",
                "instructions": "Send BTC to custom address"
            }
        ]
        
        resp = requests.put(f"{BASE_URL}/admin/payment-methods", 
                          json={"methods": custom_methods}, 
                          headers=headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        saved_methods = resp.json()
        assert len(saved_methods) == 2, f"Expected 2 methods, got {len(saved_methods)}"
        
        log_success("PUT /admin/payment-methods saved custom methods")
        
        # Verify public endpoint reflects the saved methods
        resp = requests.get(f"{BASE_URL}/payment-methods")
        public_methods = resp.json()
        public_ids = [m.get("id") for m in public_methods]
        assert "custom_paypal" in public_ids, "Custom PayPal not in public methods"
        assert "custom_btc" in public_ids, "Custom BTC not in public methods"
        
        log_success("Verified public /payment-methods reflects saved custom methods")
        return True
    except Exception as e:
        log_error(f"Admin save payment methods failed: {e}")
        return False

def test_admin_routes_without_token():
    """Test that admin routes reject requests without token"""
    log_test("Admin Routes Without Token")
    all_passed = True
    
    endpoints = [
        ("GET", "/admin/items"),
        ("POST", "/admin/items"),
        ("GET", "/admin/orders"),
        ("GET", "/admin/payment-methods"),
    ]
    
    for method, path in endpoints:
        try:
            if method == "GET":
                resp = requests.get(f"{BASE_URL}{path}")
            elif method == "POST":
                resp = requests.post(f"{BASE_URL}{path}", json={})
            
            if resp.status_code in [401, 403]:
                log_success(f"{method} {path} correctly rejected without token ({resp.status_code})")
            else:
                log_error(f"{method} {path} should reject without token, got {resp.status_code}")
                all_passed = False
        except Exception as e:
            log_error(f"{method} {path} test failed: {e}")
            all_passed = False
    
    return all_passed

def main():
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Adurite Clone Backend API Test Suite{RESET}")
    print(f"{BLUE}Base URL: {BASE_URL}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    results = []
    
    # Public endpoints
    results.append(("Public Root", test_public_root()))
    results.append(("Public Items", test_public_items()))
    results.append(("Public Payment Methods", test_public_payment_methods()))
    results.append(("Create Order", test_create_order()))
    results.append(("List Orders", test_list_orders()))
    
    # Admin auth
    results.append(("Admin Login Wrong Password", test_admin_login_wrong_password()))
    results.append(("Admin Login Correct", test_admin_login_correct()))
    results.append(("Admin Me No Token", test_admin_me_no_token()))
    results.append(("Admin Me With Token", test_admin_me_with_token()))
    
    # Admin items CRUD
    results.append(("Admin Create Item", test_admin_create_item()))
    results.append(("Admin List Items", test_admin_list_items()))
    results.append(("Public Items Includes Admin Item", test_public_items_includes_admin_item()))
    results.append(("Admin Update Item", test_admin_update_item()))
    results.append(("Admin Update Nonexistent Item", test_admin_update_nonexistent_item()))
    results.append(("Admin Delete Item", test_admin_delete_item()))
    results.append(("Admin Delete Nonexistent Item", test_admin_delete_nonexistent_item()))
    
    # Admin orders
    results.append(("Admin List Orders", test_admin_list_orders()))
    results.append(("Admin Update Order Status", test_admin_update_order_status()))
    results.append(("Admin Update Nonexistent Order", test_admin_update_nonexistent_order()))
    
    # Admin payment methods
    results.append(("Admin Get Payment Methods", test_admin_get_payment_methods()))
    results.append(("Admin Save Payment Methods", test_admin_save_payment_methods()))
    
    # Security tests
    results.append(("Admin Routes Without Token", test_admin_routes_without_token()))
    
    # Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"{status} - {name}")
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Total: {passed}/{total} tests passed{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
