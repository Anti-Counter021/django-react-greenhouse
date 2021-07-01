from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """ Пользователь """

    email = models.EmailField(verbose_name='Почта', unique=True)
    phone = models.CharField(max_length=30, verbose_name='Номер телефона')
    address = models.CharField(max_length=300, verbose_name='Адрес')
    orders = models.ManyToManyField('shop.Order', verbose_name='Заказы', related_name='customer', null=True, blank=True)
