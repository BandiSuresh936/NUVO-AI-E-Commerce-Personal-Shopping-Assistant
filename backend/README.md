# NUVO Backend

This folder contains the Django REST-style backend for the NUVO shopping assistant.
It provides authentication, product management, order creation, order tracking, and
optional Twilio SMS notifications.

## Requirements

- Python 3.10 or newer
- PowerShell on Windows
- MySQL 8.0 or newer

## Setup on Windows

Open PowerShell in this `backend` folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
```

If PowerShell blocks script execution, run this once in the current terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

## Start the server

```powershell
python manage.py runserver 127.0.0.1:8000
```

The API is available at:

```text
http://127.0.0.1:8000/api/
```

Quick health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health/
```

Expected response:

```json
{"status":"ok","service":"nuvo-api"}
```

## Database configuration

MySQL is used by default. Set these environment variables before starting Django:

```powershell
$env:DB_ENGINE = "mysql"
$env:DB_NAME = "nuvo"
$env:DB_USER = "root"
$env:DB_PASSWORD = "your-password"
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nuvo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
python manage.py migrate
```

Useful application settings:

```powershell
$env:DJANGO_DEBUG = "1"
$env:DJANGO_SECRET_KEY = "replace-this-in-production"
$env:DJANGO_ALLOWED_HOSTS = "localhost,127.0.0.1"
```

## Authentication

Register a customer:

```powershell
$body = @{ action="register"; name="Priya Sharma"; email="priya@example.com"; phone="9876543210"; password="demo-password" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/auth/ -ContentType "application/json" -Body $body
```

Login uses the same endpoint with `action=login` (or without an action):

```json
{
	"action": "login",
	"email": "priya@example.com",
	"password": "demo-password"
}
```

The response contains a token. Send it with authenticated requests using:

```text
X-Auth-Token: <token>
```

There is no public admin registration endpoint. To create an admin, register an
account and set `is_admin` to `true` in the database or Django shell:

```powershell
python manage.py shell
```

```python
from api.models import Account
Account.objects.filter(email="admin@example.com").update(is_admin=True)
```

## API endpoints

All endpoints are under `/api/`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/health/` | Public | Check that the API is running |
| POST | `/auth/` | Public | Register or login |
| GET | `/products/` | Public | List active products |
| POST | `/products/` | Admin | Create a product |
| PATCH | `/products/<id>/` | Admin | Update a product |
| GET | `/orders/` | Login | List own orders; admins see all orders |
| POST | `/orders/` | Login | Create an order |
| GET | `/orders/<id>/` | Login | View order status and location |
| PATCH | `/orders/<id>/` | Login/Admin | Cancel or update order status |
| POST | `/orders/<id>/location/` | Owner | Save delivery latitude and longitude |

## Common request examples

List products:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/products/
```

Create an order with the login token:

```powershell
$headers = @{ "X-Auth-Token" = "<token>" }
$body = @{
	customer_name = "Priya Sharma"
	customer_email = "priya@example.com"
	customer_phone = "9876543210"
	total = 3499
	payment_method = "card"
	delivery_address = "221B Residency Road, Bengaluru"
	items = @(@{ id = 1; title = "AirWave Pro Earbuds"; quantity = 1; price = 3499 })
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/orders/ -Headers $headers -ContentType "application/json" -Body $body
```

Update an order status as an admin:

```powershell
$headers = @{ "X-Auth-Token" = "<admin-token>" }
$body = @{ status = "shipped" } | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri http://127.0.0.1:8000/api/orders/1/ -Headers $headers -ContentType "application/json" -Body $body
```

Customer accounts can cancel orders only while the status is `placed` or
`processing`. Admins can set `placed`, `processing`, `shipped`, `out_for_delivery`,
`delivered`, or `cancelled`.

## Optional SMS notifications

Order SMS notifications are sent only when all of these environment variables are
configured and the order has a customer phone number:

```powershell
$env:TWILIO_ACCOUNT_SID = "your-account-sid"
$env:TWILIO_AUTH_TOKEN = "your-auth-token"
$env:TWILIO_FROM_NUMBER = "+10000000000"
```

Without these values, the order still succeeds and the response reports
`sms_sent: false`.

## Development notes

- Run `python manage.py migrate` after pulling migration changes.
- Keep `DJANGO_DEBUG=0` and use a strong `DJANGO_SECRET_KEY` in production.
- The current API enables permissive CORS (`*`) for local frontend development;
	restrict this before deploying publicly.
- Passwords are stored as SHA-256 hashes in the current demo implementation.
	Use Django's password hashing utilities before production use.
