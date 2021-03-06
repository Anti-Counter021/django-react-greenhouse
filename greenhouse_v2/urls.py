from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from .yasg import urlpatterns as doc_url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/password/reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('shop.urls')),
    path('', include('main.urls')),
]

urlpatterns += doc_url

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
