from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .cart import get_cart, get_or_create_cart_product, recalculate_cart
from .models import Category, Product, CartProduct, Order
from .send_mail import send_manager_about_new_order
from .serializers import CustomCategorySerializer, ProductSerializer, CartSerializer


class CategoryAPIView(ListAPIView):
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


class ActionCartAPIView(APIView):
    """ Действие с товарами в корзине """

    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        """ Добавление товара в корзину """

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

    def put(self, request, *args, **kwargs):
        """ Изменение количества товара в корзине """

        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        cart_product.qty = int(kwargs['qty'])
        cart_product.save()
        recalculate_cart(cart_product.cart)
        return Response({
            'detail': 'Количество товара успешно изменено',
            'final_price': cart_product.final_price, 'cart_price': cart_product.cart.final_price
        })

    def delete(self, request, *args, **kwargs):
        """ Удаление товара из корзины """

        cart = get_cart(request.user)
        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        cart.products.remove(cart_product)
        cart_product.delete()
        recalculate_cart(cart)
        return Response({'detail': 'Товар успешно удалён'})


class OrderAPIView(APIView):
    """ Заказы """

    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        attrs = request.data
        cart = get_cart(request.user)
        order = Order.objects.create(
            user=request.user, cart=cart, first_name=attrs['first_name'],
            last_name=attrs['last_name'], phone=attrs['phone'], address=attrs['address'],
            buying_type=attrs['buying_type'], comment=attrs['comment']
        )
        cart.in_order = True
        cart.save()
        request.user.orders.add(order)
        request.user.save()
        send_manager_about_new_order(order)
        return Response({'detail': 'Заказ создан успешно. Ждите ответа'})
