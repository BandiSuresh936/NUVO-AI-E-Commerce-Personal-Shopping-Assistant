import json
import hashlib
import os
import secrets
from urllib.request import Request, urlopen

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Account, Order, Product


def _response(data, status=200):
    response = JsonResponse(data, status=status, safe=False)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "Content-Type, X-Auth-Token"
    response["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
    return response


def _payload(request):
    try:
        return json.loads(request.body or "{}")
    except (TypeError, ValueError, json.JSONDecodeError):
        return None


def _account(request, admin=False):
    token = request.headers.get("X-Auth-Token", "")
    account = Account.objects.filter(token=token).first()
    if not account or (admin and not account.is_admin):
        return None
    return account


def _password(value):
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()


def auth(request):
    if request.method == "OPTIONS":
        return _response({}, status=204)
    payload = _payload(request)
    if not payload:
        return _response({"error": "invalid JSON payload"}, status=400)
    action = payload.get("action", "login")
    email = str(payload.get("email", "")).strip().lower()
    if action == "register":
        required = ["name", "phone", "password"]
        if not email or any(not payload.get(field) for field in required):
            return _response({"error": "name, email, phone and password are required"}, status=400)
        if Account.objects.filter(email=email).exists():
            return _response({"error": "account already exists"}, status=409)
        account = Account.objects.create(name=payload["name"], email=email, phone=payload["phone"], password_hash=_password(payload["password"]), token=secrets.token_urlsafe(32))
    else:
        account = Account.objects.filter(email=email, password_hash=_password(payload.get("password", ""))).first()
        if not account:
            return _response({"error": "invalid email or password"}, status=401)
        account.token = secrets.token_urlsafe(32)
        account.save(update_fields=["token"])
    return _response({"token": account.token, "user": {"name": account.name, "email": account.email, "phone": account.phone, "is_admin": account.is_admin}})


def notify_sms(order):
    sid, token, sender = os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"), os.getenv("TWILIO_FROM_NUMBER")
    if not all([sid, token, sender, order.customer_phone]):
        return False
    try:
        from urllib.parse import urlencode
        body = urlencode({"To": order.customer_phone, "From": sender, "Body": f"NUVO order #{order.id} placed. Total Rs.{order.total}. Status: {order.status}."}).encode()
        request = Request(f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json", data=body)
        import base64
        request.add_header("Authorization", "Basic " + base64.b64encode(f"{sid}:{token}".encode()).decode())
        urlopen(request, timeout=8)
        return True
    except Exception:
        return False


def health(request):
    return _response({"status": "ok", "service": "nuvo-api"})


def api_root(request):
    return _response({
        "service": "nuvo-api",
        "endpoints": {
            "health": "/api/health/",
            "products": "/api/products/",
            "auth": "/api/auth/",
            "orders": "/api/orders/",
        },
    })


def products(request):
    if request.method == "OPTIONS":
        return _response({}, status=204)
    if request.method == "GET":
        admin = _account(request, admin=True)
        queryset = Product.objects.all() if admin else Product.objects.filter(is_active=True)
        data = list(queryset.values("id", "title", "category", "price", "description", "image", "is_active"))
        return _response(data)
    account = _account(request, admin=True)
    if not account:
        return _response({"error": "admin login required"}, status=401)
    payload = _payload(request) or {}
    if request.method == "POST":
        required = ["title", "category", "price"]
        if any(not payload.get(field) for field in required):
            return _response({"error": "title, category and price are required"}, status=400)
        product = Product.objects.create(title=payload["title"], category=payload["category"], price=payload["price"], description=payload.get("description", ""), image=payload.get("image", ""))
        return _response({"id": product.id, "title": product.title}, status=201)
    return _response({"error": "method not allowed"}, status=405)


@csrf_exempt
def product_detail(request, product_id):
    if request.method == "OPTIONS":
        return _response({}, status=204)
    account = _account(request, admin=True)
    if not account:
        return _response({"error": "admin login required"}, status=401)
    product = Product.objects.filter(id=product_id).first()
    if not product:
        return _response({"error": "product not found"}, status=404)
    if request.method == "PATCH":
        payload = _payload(request) or {}
        for field in ["title", "category", "price", "description", "image", "is_active"]:
            if field in payload:
                setattr(product, field, payload[field])
        product.save()
        return _response({"id": product.id, "is_active": product.is_active})
    return _response({"error": "method not allowed"}, status=405)


@csrf_exempt
def orders(request):
    if request.method == "OPTIONS":
        response = _response({}, status=204)
        response["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-Auth-Token"
        return response
    if request.method == "GET":
        account = _account(request)
        if not account:
            return _response({"error": "login required"}, status=401)
        queryset = Order.objects.order_by("-created_at") if account.is_admin else Order.objects.filter(account=account).order_by("-created_at")
        data = list(queryset.values("id", "customer_name", "customer_email", "customer_phone", "total", "status", "payment_method", "delivery_address", "latitude", "longitude", "items", "created_at"))
        return _response(data)
    if request.method != "POST":
        return _response({"error": "method not allowed"}, status=405)
    try:
        payload = json.loads(request.body or "{}")
        account = _account(request)
        if not account:
            return _response({"error": "login required"}, status=401)
        required = ["customer_name", "customer_email", "total", "items"]
        if any(field not in payload for field in required):
            return _response({"error": "customer_name, customer_email, total and items are required"}, status=400)
        order = Order.objects.create(
            account=account if not account.is_admin else None,
            customer_name=payload["customer_name"],
            customer_email=payload["customer_email"],
            customer_phone=payload.get("customer_phone", account.phone if not account.is_admin else ""),
            total=payload["total"],
            payment_method=payload.get("payment_method", ""),
            delivery_address=payload.get("delivery_address", ""),
            items=payload["items"],
        )
        sms_sent = notify_sms(order)
        sms_message = "SMS sent" if sms_sent else "SMS not sent: configure Twilio credentials and use an international phone number"
        return _response({"id": order.id, "status": order.status, "sms_sent": sms_sent, "sms_message": sms_message}, status=201)
    except (TypeError, ValueError, json.JSONDecodeError):
        return _response({"error": "invalid JSON payload"}, status=400)


@csrf_exempt
def order_detail(request, order_id):
    if request.method == "OPTIONS":
        return _response({}, status=204)
    account = _account(request)
    if not account:
        return _response({"error": "login required"}, status=401)
    order = Order.objects.filter(id=order_id).first()
    if not order or (not account.is_admin and order.account_id != account.id):
        return _response({"error": "order not found"}, status=404)
    if request.method == "GET":
        return _response({"id": order.id, "status": order.status, "latitude": order.latitude, "longitude": order.longitude, "customer_name": order.customer_name, "total": order.total})
    if request.method == "PATCH":
        payload = _payload(request) or {}
        requested_status = payload.get("status")
        if account.is_admin:
            allowed = {"placed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"}
        else:
            allowed = {"cancelled"} if order.status in {"placed", "processing"} else set()
        if requested_status not in allowed:
            return _response({"error": "invalid status"}, status=400)
        order.status = requested_status
        order.save(update_fields=["status"])
        notify_sms(order)
        return _response({"id": order.id, "status": order.status})
    return _response({"error": "method not allowed"}, status=405)


@csrf_exempt
def order_location(request, order_id):
    if request.method == "OPTIONS":
        return _response({}, status=204)
    account = _account(request)
    order = Order.objects.filter(id=order_id, account=account).first() if account else None
    if not order:
        return _response({"error": "login required or order not found"}, status=401)
    if request.method == "POST":
        payload = _payload(request) or {}
        try:
            order.latitude, order.longitude = float(payload["latitude"]), float(payload["longitude"])
        except (KeyError, TypeError, ValueError):
            return _response({"error": "latitude and longitude are required"}, status=400)
        order.save(update_fields=["latitude", "longitude"])
    return _response({"order_id": order.id, "latitude": order.latitude, "longitude": order.longitude})