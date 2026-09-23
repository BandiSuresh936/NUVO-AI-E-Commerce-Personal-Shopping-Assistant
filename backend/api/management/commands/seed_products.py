from django.core.management.base import BaseCommand

from api.models import Product


PRODUCTS = [
    ("AirWave Pro Earbuds", "Electronics", 3499, "Active noise cancelling, 30h battery"),
    ("PulseFit Smart Band", "Electronics", 1899, "Heart rate, sleep & 10-day battery"),
    ("Orbit Mini Speaker", "Electronics", 1599, "Pocket-sized, 12h playtime, IPX7"),
    ("SwiftCharge 65W GaN", "Electronics", 1299, "Charges laptop & phone together"),
    ("Keystroke Mechanical Keyboard", "Electronics", 3299, "Hot-swappable, tactile switches"),
    ("Hushtone ANC Headphones", "Electronics", 5499, "Studio comfort, 40h battery"),
    ("Indigo Wash Denim Jacket", "Fashion", 2199, "Classic fit, stonewashed cotton"),
    ("Oversized Cotton Tee", "Fashion", 799, "Heavyweight 220gsm cotton"),
    ("Linen Summer Shirt", "Fashion", 1699, "Breathable pure linen"),
    ("Tapered Fit Chinos", "Fashion", 1499, "Stretch cotton, all-day comfort"),
    ("Merino Blend Sweater", "Fashion", 2599, "Soft merino wool blend"),
    ("TrailRunner Sneakers", "Fashion", 2999, "Lightweight cushioned sole"),
    ("Terra Ceramic Table Lamp", "Home & Living", 1899, "Warm glow, handcrafted base"),
    ("Acacia Cutting Board Set", "Home & Living", 1299, "3-piece solid acacia wood"),
    ("Amber Soy Candle", "Home & Living", 599, "45h burn, sandalwood & amber"),
    ("Cloudknit Throw Blanket", "Home & Living", 1499, "Chunky knit, ultra soft"),
    ("Stoneware Mug Set of 4", "Home & Living", 999, "Reactive glaze, dishwasher safe"),
    ("Woven Seagrass Basket", "Home & Living", 1099, "Handwoven storage, two sizes"),
    ("Heritage Leather Wallet", "Accessories", 1199, "Full-grain leather, slim fit"),
    ("Meridian Minimalist Watch", "Accessories", 3999, "Sapphire glass, 5ATM"),
    ("Horizon Aviator Sunglasses", "Accessories", 1399, "Polarized, UV400 protection"),
    ("Canvas Weekender Tote", "Accessories", 1099, "Heavy canvas, leather trim"),
    ("Luna Silver Hoop Earrings", "Accessories", 899, "925 sterling silver"),
    ("Woven Leather Belt", "Accessories", 999, "Hand-woven, brass buckle"),
]


class Command(BaseCommand):
    help = "Create or update the demo product catalog."

    def handle(self, *args, **options):
        for title, category, price, description in PRODUCTS:
            Product.objects.update_or_create(
                title=title,
                defaults={
                    "category": category,
                    "price": price,
                    "description": description,
                    "is_active": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PRODUCTS)} products."))
