from django.contrib import admin

from .models import Category, Product, CartProduct, Cart


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(CartProduct)
admin.site.register(Cart)
