from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueTogetherValidator

from .models import User


class UserSerializer(ModelSerializer):
    """ Пользователь """

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'address', 'email')
        validators = [
            UniqueTogetherValidator(queryset=User.objects.all(), fields=['email']),
        ]
