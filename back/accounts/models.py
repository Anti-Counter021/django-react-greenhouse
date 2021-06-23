from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """ Пользователь """

    phone = models.CharField(max_length=30, verbose_name='Номер телефона')
    address = models.CharField(max_length=300, verbose_name='Адрес')
