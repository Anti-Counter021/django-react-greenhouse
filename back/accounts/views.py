from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from shop.serializers import CreateOrderSerializer
from shop.models import Order
from shop.cart import get_cart

from .models import User
from .serializers import UserSerializer, RegisterUserSerializer


#                               Need testing!!!
# =======================================================================================
class ExistsUsernameView(APIView):
    """ Есть такое username? (для бота) """

    def post(self, request, *args, **kwargs):
        if not User.objects.filter(username=request.data['username']).exists():
            return Response({'username': False}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'username': True}, status=status.HTTP_200_OK)


class ExistsEmailView(APIView):
    """ Есть такая почта? (для бота) """

    def post(self, request, *args, **kwargs):
        if not User.objects.filter(email=request.data['email']).exists():
            return Response({'email': False}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'email': True}, status=status.HTTP_200_OK)
# =======================================================================================


class UserIsAuthenticatedView(APIView):
    """ Пользователь аутентифицирован? """

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response(
                {'is_authenticated': True, 'cart_count': get_cart(request.user).total_products},
                status=status.HTTP_200_OK,
            )
        return Response({'is_authenticated': False, 'cart_count': 0}, status=status.HTTP_200_OK)


class RegisterAPIView(CreateAPIView):
    """ Регистрация """

    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': 'Пользователь создан'}, status=status.HTTP_201_CREATED)


class LogoutAPIView(APIView):
    """ Выход """

    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response({'success': 'Токен пользователя удалён'}, status=status.HTTP_200_OK)


class UserProfileAPIView(ListAPIView):
    """ Профиль """

    queryset = Order.objects
    serializer_class = CreateOrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class UserDataUpdateAPIView(RetrieveUpdateAPIView):
    """ Изменение личных данных пользователя """

    queryset = User.objects
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user
