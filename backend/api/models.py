from django.db import models


class Account(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=128)
    token = models.CharField(max_length=64, unique=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Product(models.Model):
    title = models.CharField(max_length=180)
    category = models.CharField(max_length=80)
    price = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Order(models.Model):
    account = models.ForeignKey(Account, null=True, blank=True, on_delete=models.SET_NULL)
    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20, blank=True)
    total = models.PositiveIntegerField()
    status = models.CharField(max_length=30, default="placed")
    payment_method = models.CharField(max_length=40, blank=True)
    delivery_address = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    items = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.pk}"