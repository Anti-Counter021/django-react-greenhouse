from django.urls import path

from .views import (
    CategoryAPIView,
    ProductAPIView,
    NewProductAPIView,
    ProductDetailAPIView,
    CartAPIView,
    ActionCartAPIView,
)

app_name = 'shop'
urlpatterns = [
    path('categories/', CategoryAPIView.as_view(), name='categories'),
    path('new-product', NewProductAPIView.as_view(), name='new'),
    path('products/', ProductAPIView.as_view(), name='products'),
    path('cart/change-qty/<int:cart_product_id>/<int:qty>', ActionCartAPIView.as_view(), name='change_qty_from_cart'),
    path('cart/add/<int:product_id>', ActionCartAPIView.as_view(), name='add_to_cart'),
    path('cart/remove/<int:cart_product_id>', ActionCartAPIView.as_view(), name='remove_from_cart'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('products/<str:slug>', ProductDetailAPIView.as_view(), name='product_detail'),
]
