from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Category, Product
from .serializers import CustomCategorySerializer, ProductSerializer


class CategoryAPIView(ModelViewSet):
    """ Категории """

    queryset = Category.objects
    serializer_class = CustomCategorySerializer


class ProductAPIView(ModelViewSet):
    """ Товары """

    queryset = Product.objects
    serializer_class = ProductSerializer


class NewProductAPIView(APIView):
    """ Новый товар """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.first()).data)


class GreenhouseAPIView(APIView):
    """ Теплицы """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.filter(category__slug='greenhouses'), many=True).data)
