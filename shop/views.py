from django.shortcuts import get_object_or_404

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, CreateAPIView, ListCreateAPIView
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ViewSet

from .cart import get_cart, get_or_create_cart_product, recalculate_cart
from .filters import ReviewFilter
from .models import Category, Product, CartProduct, Order, Review, Feedback
from .pagination import PaginationAPIView, ReviewPaginationAPIView
from .send_mail import send_manager_about_new_order
from .serializers import (
    CustomCategorySerializer,
    ProductSerializer,
    CartSerializer,
    FeedbackSerializer,
    CreateOrderSerializer,
    CreateReviewSerializer,
)


class CategoryAPIView(ListAPIView):
    """ Категории """

    queryset = Category.objects.all()
    serializer_class = CustomCategorySerializer


class ProductAPIView(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    """ Товары """

    queryset = Product.objects.filter(delivery_terminated=False)
    serializer_class = ProductSerializer
    pagination_class = PaginationAPIView
    lookup_field = 'slug'


class NewProductAPIView(APIView):
    """ Новый товар """

    def get(self, request, *args, **kwargs):
        return Response(
            ProductSerializer(Product.objects.filter(delivery_terminated=False).order_by('-id').first()).data,
            status=status.HTTP_200_OK,
        )


class CartAPIView(ViewSet):
    """ Действие с товарами в корзине """

    @action(methods=['get'], detail=False)
    def get(self, request, *args, **kwargs):
        """ Получение корзины """

        return Response(CartSerializer(get_cart(request.user)).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path='add/(?P<product_id>\d+)')
    def add_to_cart(self, request, *args, **kwargs):
        """ Добавление товара в корзину """

        if request.user.is_anonymous:
            return Response({'error': 'Необходимо авторизироваться!'}, status=status.HTTP_403_FORBIDDEN)
        cart = get_cart(request.user)
        product = get_object_or_404(Product, id=kwargs['product_id'])
        cart_product, created = get_or_create_cart_product(request.user, cart, product)
        if created:
            if not product.discount:
                cart_product.price = product.price
            else:
                cart_product.price = product.get_price_with_discount()
            cart_product.save()
            cart.products.add(cart_product)
            recalculate_cart(cart)
            return Response({'detail': 'Товар добавлен в корзину', 'added': True}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Товар уже в корзине', 'added': False}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['put'], detail=False, url_path='change-qty/(?P<cart_product_id>\d+)/(?P<qty>\d+)')
    def change_qty(self, request, *args, **kwargs):
        """ Изменение количества товара в корзине """

        if request.user.is_anonymous:
            return Response({'error': 'Необходимо авторизироваться!'}, status=status.HTTP_403_FORBIDDEN)
        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        if cart_product.user != request.user:
            return Response(
                {'error': 'Вы не имеете права изменять что-то не в своей корзине!'},
                status=status.HTTP_403_FORBIDDEN,
            )
        cart_product.qty = int(kwargs['qty'])
        cart_product.save()
        recalculate_cart(cart_product.cart)
        return Response(
            {
                'detail': 'Количество товара успешно изменено',
                'final_price': cart_product.final_price, 'cart_price': cart_product.cart.final_price,
            },
            status=status.HTTP_200_OK,
        )

    @action(methods=['delete'], detail=False, url_path='remove/(?P<cart_product_id>\d+)')
    def delete_from_cart(self, request, *args, **kwargs):
        """ Удаление товара из корзины """

        if request.user.is_anonymous:
            return Response({'error': 'Необходимо авторизироваться!'}, status=status.HTTP_403_FORBIDDEN)
        cart = get_cart(request.user)
        cart_product = get_object_or_404(CartProduct, id=kwargs['cart_product_id'])
        if cart_product.user != request.user:
            return Response(
                {'error': 'Вы не имеете права удалять что-то не в своей корзине!'}, status=status.HTTP_403_FORBIDDEN
            )
        cart.products.remove(cart_product)
        cart_product.delete()
        recalculate_cart(cart)
        return Response({'detail': 'Товар успешно удалён'}, status=status.HTTP_200_OK)


class CreateOrderAPIView(CreateAPIView):
    """ Заказы """

    permission_classes = (IsAuthenticated,)
    serializer_class = CreateOrderSerializer
    queryset = Order.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = get_cart(request.user)
        order = serializer.save(cart=cart, user=request.user)
        cart.in_order = True
        cart.save()
        request.user.orders.add(order)
        request.user.save()
        send_manager_about_new_order(order)
        return Response({'detail': 'Заказ создан успешно. Ждите ответа'}, status=status.HTTP_201_CREATED)


class ReviewAPIView(ListCreateAPIView):
    """ Отзывы """

    queryset = Review.objects.all()
    serializer_class = CreateReviewSerializer
    pagination_class = ReviewPaginationAPIView
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ReviewFilter

    def create(self, request, *args, **kwargs):
        if request.user.is_anonymous:
            return Response(
                {'error': 'Чтобы оставить отзыв необходимо быть авторизованным!'}, status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response({'detail': 'Спасибо за отзыв!'}, status=status.HTTP_201_CREATED)


class FeedbackCreateAPIView(CreateAPIView):
    """ Создание сообщения о багах """

    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
