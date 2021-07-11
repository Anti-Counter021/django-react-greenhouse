from django.urls import path

from .views import page, detail_page, favicon, logo_192, logo_512, manifest, robots

app_name = 'main'
urlpatterns = [
    path('', page, name='home'),
    path('contacts', page, name='contacts'),
    path('categories/<str:slug>', detail_page, name='category_detail'),
    path('categories', page, name='categories'),
    path('products/<str:slug>', detail_page, name='product_detail'),
    path('reviews', page, name='reviews'),
    path('cart', page, name='cart'),
    path('password/reset/request', page, name='reset_password_request'),
    path('password/reset', page, name='reset_password'),
    path('profile/change', page, name='profile_change'),
    path('profile', page, name='profile'),
    path('login', page, name='login'),
    path('logout', page, name='logout'),
    path('register', page, name='register'),
    path('order', page, name='order'),
    path('favicon.ico', favicon, name='favicon'),
    path('logo192.png', logo_192, name='logo_192'),
    path('logo512.png', logo_512, name='logo_512'),
    path('manifest.json', manifest, name='manifest'),
    path('robots.txt', robots, name='robots'),
]
