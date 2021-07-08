from django.contrib import admin

from .models import User


class UserAdmin(admin.ModelAdmin):
    """ Пользователи """

    list_display = ('username', 'phone', 'email', 'address')
    search_fields = ('username', 'address', 'phone', 'email')
    fields = (
        'username',
        ('first_name', 'last_name'),
        'email', 'phone', 'address',
        'password',
        'groups', 'user_permissions',
        ('is_superuser', 'is_staff', 'is_active'),
        ('date_joined', 'last_login'),
        'orders',
    )
    readonly_fields = ('date_joined', 'last_login')
    actions = None

    def has_delete_permission(self, request, obj=None):
        return False


admin.site.register(User, UserAdmin)
