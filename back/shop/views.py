from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Category, Product, CartProduct
from .serializers import CustomCategorySerializer, ProductSerializer, CartSerializer
from .cart import get_cart, get_or_create_cart_product, recalculate_cart


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


class ProductDetailAPIView(APIView):
    """ Детализация товара """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.filter(slug=kwargs['slug']).first()).data)


class CartAPIView(APIView):
    """ Получение корзины """

    def get(self, request, *args, **kwargs):
        return Response(CartSerializer(get_cart(request.user)).data)


class AddToCartAPIView(APIView):
    """ Добавление товара в корзину """

    def post(self, request, *args, **kwargs):
        cart = get_cart(request.user)
        product = get_object_or_404(Product, id=kwargs['product_id'])
        cart_product, created = get_or_create_cart_product(request.user, cart, product)
        if created:
            cart_product.price = product.price
            cart_product.save()
            cart.products.add(cart_product)
            recalculate_cart(cart)
            return Response({'detail': 'Товар добавлен в корзину', 'added': True})
        return Response({'detail': 'Товар уже в корзине', 'added': False}, status=status.HTTP_400_BAD_REQUEST)


class ChangeQTYAPIView(APIView):
    """ Изменение количества товара в корзине """

    def put(self, request, *args, **kwargs):
        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        cart_product.qty = int(kwargs['qty'])
        cart_product.save()
        recalculate_cart(cart_product.cart)
        return Response({'detail': 'Количество товара успешно изменено'})


class RemoveFromCart(APIView):
    """ Удаление товара из корзины """

    def delete(self, request, *args, **kwargs):
        cart = get_cart(request.user)
        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        cart.products.remove(cart_product)
        cart_product.delete()
        recalculate_cart(cart)
        return Response({'detail': 'Товар успешно удалён'})
