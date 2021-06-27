from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    CategoryAPIView,
    ProductAPIView,
    NewProductAPIView,
    ProductDetailAPIView,
    CartAPIView,
    AddToCartAPIView,
    ChangeQTYAPIView,
    RemoveFromCart,
)

router = DefaultRouter()
router.register(r'categories', CategoryAPIView)

app_name = 'shop'
urlpatterns = [
    path('', include(router.urls)),
    path('new-product', NewProductAPIView.as_view(), name='new'),
    path('products/', ProductAPIView.as_view(), name='products'),
    path('cart/change-qty/<int:cart_product_id>/<int:qty>', ChangeQTYAPIView.as_view(), name='change_qty_from_cart'),
    path('cart/add/<int:product_id>', AddToCartAPIView.as_view(), name='add_to_cart'),
    path('cart/remove/<int:cart_product_id>', RemoveFromCart.as_view(), name='remove_from_cart'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('products/<str:slug>', ProductDetailAPIView.as_view(), name='product_detail'),
]
