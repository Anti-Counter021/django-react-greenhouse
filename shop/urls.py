from django.urls import path, include

from rest_framework.routers import SimpleRouter

from .views import (
    CategoryAPIView,
    ProductAPIView,
    NewProductAPIView,
    CartAPIView,
    CreateOrderAPIView,
    ReviewAPIView,
    FeedbackCreateAPIView,
)

router = SimpleRouter()

router.register('cart', CartAPIView, basename='cart')

app_name = 'shop'
urlpatterns = [
    path('', include(router.urls)),
    path('feedback', FeedbackCreateAPIView.as_view(), name='feedback'),
    path('categories/', CategoryAPIView.as_view(), name='categories'),
    path('reviews/', ReviewAPIView.as_view(), name='reviews'),
    path('orders/', CreateOrderAPIView.as_view(), name='orders'),
    path('products/new-product', NewProductAPIView.as_view(), name='new'),
    path('products/<str:slug>', ProductAPIView.as_view({'get': 'retrieve'}), name='product_detail'),
    path('products/', ProductAPIView.as_view({'get': 'list'}), name='products'),
]
