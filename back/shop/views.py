from datetime import datetime

from django.shortcuts import get_object_or_404

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ViewSet

from .cart import get_cart, get_or_create_cart_product, recalculate_cart
from .filters import ReviewFilter
from .models import Category, Product, CartProduct, Order, Review
from .pagination import PaginationAPIView
from .send_mail import send_manager_about_new_order
from .serializers import CustomCategorySerializer, ProductSerializer, CartSerializer, ReviewSerializer


class CategoryAPIView(ListModelMixin, GenericViewSet):
    """ Категории """

    queryset = Category.objects
    serializer_class = CustomCategorySerializer


class ProductAPIView(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    """ Товары """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = PaginationAPIView
    lookup_field = 'slug'


class NewProductAPIView(APIView):
    """ Новый товар """

    def get(self, request, *args, **kwargs):
        return Response(ProductSerializer(Product.objects.order_by('-id').first()).data)


class CartAPIView(ViewSet):
    """ Действие с товарами в корзине """

    @action(methods=['get'], detail=False)
    def get(self, request, *args, **kwargs):
        """ Получение корзины """

        return Response(CartSerializer(get_cart(request.user)).data)

    @action(methods=['post'], detail=False, url_path='add/(?P<product_id>\d+)')
    def add_to_cart(self, request, *args, **kwargs):
        """ Добавление товара в корзину """

        if request.user.is_anonymous:
            return Response({'error': 'Необходимо авторизироваться!'}, status=status.HTTP_403_FORBIDDEN)
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

    @action(methods=['put'], detail=False, url_path='change-qty/(?P<cart_product_id>\d+)/(?P<qty>\d+)')
    def change_qty(self, request, *args, **kwargs):
        """ Изменение количества товара в корзине """

        if request.user.is_anonymous:
            return Response({'error': 'Необходимо авторизироваться!'}, status=status.HTTP_403_FORBIDDEN)
        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        cart_product.qty = int(kwargs['qty'])
        cart_product.save()
        recalculate_cart(cart_product.cart)
        return Response({
            'detail': 'Количество товара успешно изменено',
            'final_price': cart_product.final_price, 'cart_price': cart_product.cart.final_price
        })

    @action(methods=['delete'], detail=False, url_path='remove/(?P<cart_product_id>\d+)')
    def delete_from_cart(self, request, *args, **kwargs):
        """ Удаление товара из корзины """

        if request.user.is_anonymous:
            return Response({'error': 'Необходимо авторизироваться!'}, status=status.HTTP_403_FORBIDDEN)
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
        order_date = datetime.strptime(attrs['order_date'], '%d/%m/%Y').date()
        if order_date < datetime.today().date():
            return Response({'detail': 'Желаемая дата получения не может быть прошедшей!', 'error': 400})
        order = Order.objects.create(
            user=request.user, cart=cart, first_name=attrs['first_name'],
            last_name=attrs['last_name'], phone=attrs['phone'], address=attrs['address'],
            buying_type=attrs['buying_type'], comment=attrs['comment'],
            order_date=order_date,
        )
        cart.in_order = True
        cart.save()
        request.user.orders.add(order)
        request.user.save()
        send_manager_about_new_order(order)
        return Response({'detail': 'Заказ создан успешно. Ждите ответа'})


class ReviewAPIView(ListAPIView):

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    pagination_class = PaginationAPIView
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ReviewFilter


class CreateReviewAPIView(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        attrs = request.data
        Review.objects.create(user=request.user, appraisal=attrs['appraisal'], comment=attrs['comment'])
        return Response({'detail': 'Спасибо за отзыв!'})
