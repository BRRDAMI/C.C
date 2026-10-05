# Adurite Clone — API Contracts

## Auth
- Admin credentials in backend/.env: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`.
- JWT Bearer token returned on login, sent as `Authorization: Bearer <token>` for admin routes.

## Public endpoints (prefix /api)
- `GET  /api/items`            -> list admin-added items (shown on homepage)
- `GET  /api/payment-methods`  -> list receiving accounts (checkout)
- `POST /api/orders`           -> create order {item_id,item_name,item_image,total,roblox_username,payment_method,payment_detail}
- `GET  /api/orders`           -> list recent orders (for user Orders page; demo)

## Admin endpoints (Bearer token)
- `POST   /api/admin/login`               -> {username,password} => {token}
- `GET    /api/admin/me`                  -> verify token => {ok:true}
- `GET    /api/admin/items`               -> list admin items
- `POST   /api/admin/items`               -> create item
- `PUT    /api/admin/items/{id}`          -> update item
- `DELETE /api/admin/items/{id}`          -> delete item
- `GET    /api/admin/orders`              -> list all orders
- `PATCH  /api/admin/orders/{id}`         -> {status} update order status
- `GET    /api/admin/payment-methods`     -> list methods
- `PUT    /api/admin/payment-methods`     -> replace full list

## Models
- Item: {id, name, category, rap, price:number, image, trending:bool, admin:true, created_at}
- Order: {id, item_id, item_name, item_image, total:number, roblox_username, payment_method, payment_detail, status, created_at}
- PaymentMethod: {id, label, type(crypto|paypal|other), detail, instructions}

## Mock replacement
- data/mock.js keeps the base catalog (recentlySold, trending, listings) — stays frontend.
- data/store.js currently uses localStorage. Replace with API calls:
  - getAdminItems -> GET /api/items
  - admin CRUD -> /api/admin/items
  - getOrders/createOrder -> /api/orders
  - getPaymentMethods/savePaymentMethods -> /api/(admin/)payment-methods
  - isAdminAuthed/login -> token in localStorage + POST /api/admin/login
- Homepage merges base catalog (mock) + admin items (API).

## Frontend integration
- Add api.js (axios, REACT_APP_BACKEND_URL + /api). Store token in localStorage `adurite_token`.
- Admin page: real login; items/orders/payments load from API; async actions.
- Checkout: load payment methods + create order via API.
- Home: fetch admin items on mount, merge with mock base.
