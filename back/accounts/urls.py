from django.urls import path

from rest_framework.authtoken.views import obtain_auth_token

from .views import UserIsAuthenticated, RegisterAPIView, LogoutAPIView, UserProfileAPIView, UserDataUpdateAPIView


app_name = 'accounts'
urlpatterns = [
    path('token', obtain_auth_token, name='token'),
    path('user', UserIsAuthenticated.as_view(), name='user'),
    path('profile/change', UserDataUpdateAPIView.as_view(), name='profile_change'),
    path('profile', UserProfileAPIView.as_view(), name='profile'),
    path('register', RegisterAPIView.as_view(), name='register'),
    path('logout', LogoutAPIView.as_view(), name='logout'),
]
