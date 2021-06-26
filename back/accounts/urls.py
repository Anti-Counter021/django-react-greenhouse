from django.urls import path

from rest_framework.authtoken.views import obtain_auth_token

from .views import UserIsAuthenticated, RegisterView, LogoutView


app_name = 'accounts'
urlpatterns = [
    path('token', obtain_auth_token, name='token'),
    path('user', UserIsAuthenticated.as_view(), name='user'),
    path('register', RegisterView.as_view(), name='register'),
    path('logout', LogoutView.as_view(), name='logout'),
]
