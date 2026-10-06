from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import httpx
import time

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin')
JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret')
JWT_ALGO = 'HS256'
TOKEN_HOURS = 24

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=True)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DEFAULT_PAYMENT_METHODS = [
    {"id": "btc", "label": "Bitcoin", "coin": "BTC", "type": "crypto", "detail": "", "qr_image": "", "enabled": True},
    {"id": "ltc", "label": "Litecoin", "coin": "LTC", "type": "crypto", "detail": "", "qr_image": "", "enabled": True},
    {"id": "eth", "label": "Ethereum", "coin": "ETH", "type": "crypto", "detail": "", "qr_image": "", "enabled": True},
    {"id": "paypal", "label": "PayPal", "coin": "", "type": "paypal", "detail": "", "qr_image": "", "enabled": True},
]

COINGECKO_IDS = {"BTC": "bitcoin", "LTC": "litecoin", "ETH": "ethereum"}
_rates_cache = {"at": 0.0, "data": None}


# ------------------- Models -------------------
class LoginRequest(BaseModel):
    username: str
    password: str

class ItemIn(BaseModel):
    name: str
    category: str = "hat"
    rap: str = ""
    price: float
    image: str = ""
    trending: bool = True
    visible: bool = True

class Item(ItemIn):
    id: str = Field(default_factory=lambda: f"adm_{uuid.uuid4().hex[:10]}")
    admin: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderIn(BaseModel):
    item_id: str
    item_name: str
    item_image: str = ""
    total: float
    roblox_username: str
    payment_method: str
    payment_detail: str = ""
    crypto_coin: str = ""
    crypto_amount: Optional[float] = None

class Order(OrderIn):
    id: str = Field(default_factory=lambda: f"ord_{uuid.uuid4().hex[:10]}")
    status: str = "awaiting_payment"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderStatus(BaseModel):
    status: str

class PaymentMethod(BaseModel):
    id: str
    label: str
    coin: str = ""
    type: str = "crypto"
    detail: str = ""
    qr_image: str = ""
    enabled: bool = True

class PaymentMethodsIn(BaseModel):
    methods: List[PaymentMethod]


# ------------------- Auth helpers -------------------
def create_token(username: str) -> str:
    payload = {"sub": username, "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def verify_admin(creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("sub") != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return True

def clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


# ------------------- Public routes -------------------
@api_router.get("/")
async def root():
    return {"message": "Adurite API"}

@api_router.get("/items")
async def list_items():
    items = await db.items.find({"visible": {"$ne": False}}).sort("created_at", -1).to_list(1000)
    return [clean(i) for i in items]

@api_router.get("/payment-methods")
async def public_payment_methods():
    doc = await db.settings.find_one({"key": "payment_methods"})
    methods = doc["value"] if doc else DEFAULT_PAYMENT_METHODS
    return [m for m in methods if m.get("enabled", True)]

@api_router.get("/rates")
async def crypto_rates():
    now = time.time()
    if _rates_cache["data"] and now - _rates_cache["at"] < 60:
        return _rates_cache["data"]
    try:
        async with httpx.AsyncClient(timeout=8) as http:
            r = await http.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": ",".join(COINGECKO_IDS.values()), "vs_currencies": "usd"},
            )
            r.raise_for_status()
            raw = r.json()
        data = {coin: raw[cg]["usd"] for coin, cg in COINGECKO_IDS.items() if cg in raw}
        data["updated_at"] = datetime.now(timezone.utc).isoformat()
        _rates_cache.update({"at": now, "data": data})
        return data
    except Exception as e:
        logger.warning(f"rates fetch failed: {e}")
        if _rates_cache["data"]:
            return _rates_cache["data"]
        raise HTTPException(status_code=503, detail="Live rates unavailable")

@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderIn):
    order = Order(**payload.dict())
    await db.orders.insert_one(order.dict())
    return order

@api_router.get("/orders")
async def list_orders():
    orders = await db.orders.find().sort("created_at", -1).to_list(500)
    return [clean(o) for o in orders]

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return clean(order)


# ------------------- Admin routes -------------------
@api_router.post("/admin/login")
async def admin_login(payload: LoginRequest):
    if payload.username != ADMIN_USERNAME or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": create_token(payload.username)}

@api_router.get("/admin/me")
async def admin_me(_: bool = Depends(verify_admin)):
    return {"ok": True}

@api_router.get("/admin/items")
async def admin_list_items(_: bool = Depends(verify_admin)):
    items = await db.items.find().sort("created_at", -1).to_list(1000)
    return [clean(i) for i in items]

@api_router.post("/admin/items", response_model=Item)
async def admin_create_item(payload: ItemIn, _: bool = Depends(verify_admin)):
    item = Item(**payload.dict())
    await db.items.insert_one(item.dict())
    return item

@api_router.put("/admin/items/{item_id}")
async def admin_update_item(item_id: str, payload: ItemIn, _: bool = Depends(verify_admin)):
    existing = await db.items.find_one({"id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Item not found")
    update = payload.dict()
    await db.items.update_one({"id": item_id}, {"$set": update})
    updated = await db.items.find_one({"id": item_id})
    return clean(updated)

@api_router.delete("/admin/items/{item_id}")
async def admin_delete_item(item_id: str, _: bool = Depends(verify_admin)):
    res = await db.items.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"ok": True}

@api_router.get("/admin/orders")
async def admin_list_orders(_: bool = Depends(verify_admin)):
    orders = await db.orders.find().sort("created_at", -1).to_list(1000)
    return [clean(o) for o in orders]

@api_router.patch("/admin/orders/{order_id}")
async def admin_update_order(order_id: str, payload: OrderStatus, _: bool = Depends(verify_admin)):
    res = await db.orders.update_one({"id": order_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    updated = await db.orders.find_one({"id": order_id})
    return clean(updated)

@api_router.get("/admin/payment-methods")
async def admin_payment_methods(_: bool = Depends(verify_admin)):
    doc = await db.settings.find_one({"key": "payment_methods"})
    return doc["value"] if doc else DEFAULT_PAYMENT_METHODS

@api_router.put("/admin/payment-methods")
async def admin_save_payment_methods(payload: PaymentMethodsIn, _: bool = Depends(verify_admin)):
    methods = [m.dict() for m in payload.methods]
    await db.settings.update_one(
        {"key": "payment_methods"}, {"$set": {"key": "payment_methods", "value": methods}}, upsert=True
    )
    return methods


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


async def seed_catalog():
    flag = await db.settings.find_one({"key": "catalog_seeded"})
    if flag:
        return
    path = ROOT_DIR / "catalog_seed.json"
    if path.exists():
        import json
        rows = json.loads(path.read_text())
        for r in rows:
            if await db.items.find_one({"id": r["id"]}):
                continue
            item = Item(**r)
            doc = item.dict()
            doc["id"] = r["id"]
            await db.items.insert_one(doc)
    await db.settings.update_one(
        {"key": "catalog_seeded"}, {"$set": {"key": "catalog_seeded", "value": True}}, upsert=True
    )
    logger.info("catalog seeded")


@app.on_event("startup")
async def seed():
    await seed_catalog()
    doc = await db.settings.find_one({"key": "payment_methods"})
    current = doc["value"] if doc else []
    if not doc or any("coin" not in m for m in current):
        await db.settings.update_one(
            {"key": "payment_methods"},
            {"$set": {"key": "payment_methods", "value": DEFAULT_PAYMENT_METHODS}},
            upsert=True,
        )

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
