from django.urls import path

from drf_yasg import openapi
from drf_yasg.views import get_schema_view

from rest_framework.permissions import IsAdminUser


schema_view = get_schema_view(
    openapi.Info(
        title='Doctor',
        default_version='v1',
        description='Doctor App',
        license=openapi.License(name='_Counter021_'),
    ),
    public=False,
    permission_classes=(IsAdminUser,),
)

urlpatterns = [
    path('swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
