from rest_framework.response import Response
from rest_framework.views import APIView


class UserIsAuthenticated(APIView):
    """ Пользователь аутентифицирован? """

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'is_authenticated': True})
        return Response({'is_authenticated': False})

