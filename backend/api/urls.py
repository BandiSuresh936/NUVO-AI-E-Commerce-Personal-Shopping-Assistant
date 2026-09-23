from django.urls import path

from . import views


urlpatterns = [
    path("", views.api_root),
    path("health/", views.health),
    path("products/", views.products),
    path("products/<int:product_id>/", views.product_detail),
    path("auth/", views.auth),
    path("orders/", views.orders),
    path("orders/<int:order_id>/", views.order_detail),
    path("orders/<int:order_id>/location/", views.order_location),
]