from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Category, Product
from .serializers import CustomCategorySerializer, ProductSerializer


class CategoryAPIView(ModelViewSet):
    """ Категории """

    queryset = Category.objects
    serializer_class = CustomCategorySerializer
    permission_classes = (IsAuthenticated,)


class ProductAPIView(ModelViewSet):
    """ Товары """

    queryset = Product.objects
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)
