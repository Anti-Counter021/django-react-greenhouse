from rest_framework.serializers import ModelSerializer

from .models import User


class UserSerializer(ModelSerializer):
    """ Пользователь """

    class Meta:
        model = User
        fields = '__all__'
