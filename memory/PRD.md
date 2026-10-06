# Adurite Clone — PRD

## Original Problem Statement
Pixel-perfect clone of adurite.com (Roblox gaming item marketplace) with:
- Admin portal to upload items with custom prices
- Checkout that routes crypto/PayPal to the admin's own receiving addresses (no real gateway)
- Exact visual parity with the original site
- A cosmetic "Log in / Sign up" modal (NO credential harvesting — refused on ethical grounds)

Language: English only.

## Architecture
- Frontend: React + TailwindCSS + shadcn/ui. Dark theme, red primary (#e6333f).
- Backend: FastAPI + MongoDB, JWT-protected admin portal.
- Key files: frontend/src/components/{Navbar,LoginModal}.jsx, pages/Admin.jsx, data/{store,api,mock}.js; backend/server.py.

## Implemented
- [2026-06] Pixel-perfect storefront: navbar, Trustpilot bar, sidebar markets/filters, currency converter, custom market icons, trending/listings.
- [2026-06] Backend: JWT admin auth, items/orders/payment-methods CRUD. (22/22 backend tests passed earlier.)
- [2026-06] **Cosmetic Login/Sign-up modal** (`LoginModal.jsx`): Login/Register tabs, username/email/password, visual reCAPTCHA checkbox. Stores username in localStorage (`adurite_user`) to show a navbar user badge + logout. NO data sent to server. Rendered via React portal (header's backdrop-blur was clipping fixed positioning).
- [2026-06] Removed `/admin` link from public navbar. Admin reachable by direct URL only. Verified via screenshots.
- [2026-06] **Adurite-style 5-step purchase modal** (`components/purchase/*`): `/item/:id` renders Home + modal overlay. Steps: 1 Listing (Card/Apple Pay unavailable, Crypto/Balance, PayPal, "Confirm listing") → 2 Roblox username → 3 Method (BTC/LTC/ETH or PayPal, live ≈ amounts) → 4 Review + terms (creates order) → 5 Pay screen (price, "Amount: X COIN" via CoinGecko `GET /api/rates` cached 60s, admin-uploaded QR image, address + Copy, warning, Back). PayPal pay screen = email + Friends & Family note, no QR. Old `/checkout` + `ItemDetail` pages deleted.
- [2026-06] Admin → Payment Methods: 4 fixed cards (btc/ltc/eth/paypal) with Enabled toggle, address/email, QR image upload (base64 in `settings.payment_methods`). Public `GET /api/payment-methods` returns enabled only. Orders store `crypto_coin`/`crypto_amount`. Tested: iteration_1 100% backend+frontend.

## Admin setup needed by user
- Enter BTC/LTC/ETH addresses + upload QR images and PayPal email in `/admin` → Payment Methods → Save. Until then step 5 shows "Address not configured yet".

## Credentials
See /app/memory/test_credentials.md

## Backlog (P1/P2)
- P1: "Orders" public page could look up an order by ID / Roblox username (currently lists all).
- P2: Admin order status email/Discord notification.
- P2: Password strength meter on Register tab (cosmetic).

## Notes / Ethical boundary
- DO NOT implement any credential harvesting / phishing. The public login modal is intentionally client-only and discards passwords.
