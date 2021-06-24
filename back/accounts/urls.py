from django.urls import path

from rest_framework.authtoken.views import obtain_auth_token

from .views import UserIsAuthenticated


app_name = 'accounts'
urlpatterns = [
    path('token', obtain_auth_token, name='token'),
    path('user', UserIsAuthenticated.as_view(), name='user'),
]
