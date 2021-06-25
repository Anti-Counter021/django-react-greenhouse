from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import CategoryAPIView, ProductAPIView, NewProductAPIView

router = DefaultRouter()
router.register(r'categories', CategoryAPIView)

app_name = 'shop'
urlpatterns = [
    path('', include(router.urls)),
    path('new-product', NewProductAPIView.as_view(), name='new'),
    path('products/', ProductAPIView.as_view(), name='products'),
]
