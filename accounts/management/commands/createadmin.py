from django.core.management.base import BaseCommand

import os

from accounts.models import User


class Command(BaseCommand):
    """ Создание супер пользователя (для докер) """

    def handle(self, *args, **options):
        username = os.environ.get('USERNAME_MANAGER_1')
        password = os.environ.get('PASSWORD_MANAGER_1')
        email = os.environ.get('EMAIL_MANAGER_1')

        User.objects.create_superuser(username, email, password)
