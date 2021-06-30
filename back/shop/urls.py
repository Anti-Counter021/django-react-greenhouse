from django.urls import path, include

from rest_framework.routers import SimpleRouter

from .views import (
    CategoryAPIView,
    ProductAPIView,
    NewProductAPIView,
    CartAPIView,
    OrderAPIView,
    ReviewAPIView,
    CreateReviewAPIView,
)

router = SimpleRouter()

router.register('cart', CartAPIView, basename='cart')

app_name = 'shop'
urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoryAPIView.as_view({'get': 'list'}), name='categories'),
    path('reviews/add', CreateReviewAPIView.as_view(), name='create_review'),
    path('reviews/', ReviewAPIView.as_view(), name='reviews'),
    path('orders/', OrderAPIView.as_view(), name='orders'),
    path('products/new-product', NewProductAPIView.as_view(), name='new'),
    path('products/<str:slug>', ProductAPIView.as_view({'get': 'retrieve'}), name='product_detail'),
    path('products/', ProductAPIView.as_view({'get': 'list'}), name='products'),
]
