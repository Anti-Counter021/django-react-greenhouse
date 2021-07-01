from rest_framework import serializers

from .models import User


class RegisterUserSerializer(serializers.Serializer):
    """ Регистрация """

    username = serializers.CharField(max_length=50)

    email = serializers.EmailField()

    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField(max_length=30)
    address = serializers.CharField(max_length=300)
    password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'error': 'Это имя пользователя уже занято, попробуйте другое!'})

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'error': 'Эта почта уже занята, попробуйте другую!'})

        if len(data['password']) <= 8:
            raise serializers.ValidationError({'error': 'Длина должна быть больше 8 символов!'})

        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({'error': 'Пароли не совпадают!'})

        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    class Meta:
        model = User


class UserSerializer(serializers.ModelSerializer):
    """ Пользователь """

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'address', 'email')
