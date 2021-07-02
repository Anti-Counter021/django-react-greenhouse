from django.urls import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import User


class AccountsTestCase(APITestCase):
    """ Тест приложения для работы с пользователями """

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')

    def setUp(self) -> None:
        self.data = {
            'email': 'user@example.com',
            'username': 'admin',
            'password': 'admin458735',
            'first_name': 'Arkady',
            'last_name': 'Kounter',
            'phone': '88005553535',
            'address': 'Backer street 5',
            'confirm_password': 'admin458735',
        }
        self.register_url = reverse('accounts:register')
        self.logout_url = reverse('accounts:logout')
        self.profile_url = reverse('accounts:profile')
        self.profile_change_url = reverse('accounts:profile_change')
        self.user_is_authenticated_url = reverse('accounts:user')

        self.user = User.objects.create_user(username='test', password='test')
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()

    def test_user_is_authenticated_auth(self):
        response = self.client.get(self.user_is_authenticated_url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'is_authenticated': True, 'cart_count': 0})

    def test_user_is_authenticated_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.user_is_authenticated_url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'is_authenticated': False, 'cart_count': 0})

    def test_registration(self):
        response = self.client.post(self.register_url, self.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'success': 'Пользователь создан'})

    def test_logout_auth(self):
        response = self.client.get(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'success': 'Токен пользователя удалён'})

    def test_logout_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_profile_auth(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_profile_change_auth(self):
        response = self.client.get(self.profile_change_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.put(self.profile_change_url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                'email': 'user@example.com',
                'first_name': 'Arkady',
                'last_name': 'Kounter',
                'phone': '88005553535',
                'address': 'Backer street 5',
            },
        )

    def test_profile_change_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_change_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.put(self.profile_change_url, self.data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
