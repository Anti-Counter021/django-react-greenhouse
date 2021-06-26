from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Category, Product
from .serializers import CustomCategorySerializer, ProductSerializer


class CategoryAPIView(ModelViewSet):
    """ Категории """

    queryset = Category.objects
    serializer_class = CustomCategorySerializer


class ProductAPIView(APIView):
    """ Товары """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.all(), many=True).data)


class NewProductAPIView(APIView):
    """ Новый товар """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.first()).data)


class ProductDetailView(APIView):
    """ Детализация товара """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.filter(slug=kwargs['slug']).first()).data)
