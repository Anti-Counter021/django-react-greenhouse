from django.contrib.auth.password_validation import validate_password

from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User

from shop.cart import get_cart


class UserIsAuthenticated(APIView):
    """ Пользователь аутентифицирован? """

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'is_authenticated': True, 'cart_count': get_cart(request.user).products.count()})
        return Response({'is_authenticated': False, 'cart_count': 0})


class RegisterView(APIView):
    """ Регистрация """

    def post(self, request, *args, **kwargs):
        attrs = request.data

        if User.objects.filter(username=attrs['username']).exists():
            return Response(
                {'error': 'Пожалуйста введите другое имя пользователя!'})

        if User.objects.filter(email=attrs['email']).exists():
            return Response({'error': 'Пожалуйста введите другую почту!'})

        if not (attrs['password'] == attrs['confirm_password']):
            return Response({'error': 'Пароли не совпадают!'})

        try:
            validate_password(attrs['password'])
        except:
            return Response({'error': 'Пароль не надёжный!'})

        user = User.objects.create(
            username=attrs['username'], email=attrs['email'], first_name=attrs['first_name'],
            last_name=attrs['last_name'], phone=attrs['phone'], address=attrs['address']
        )

        user.set_password(attrs['password'])
        user.save()
        return Response({'success': True})


class LogoutView(APIView):
    """ Выход """

    def get(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response({'success': True})
