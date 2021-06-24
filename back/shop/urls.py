from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import CategoryAPIView, ProductAPIView

router = DefaultRouter()
router.register(r'categories', CategoryAPIView)
router.register(r'products', ProductAPIView)

app_name = 'shop'
urlpatterns = [
    path('', include(router.urls)),
]
