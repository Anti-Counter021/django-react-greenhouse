from django.contrib import admin

from .models import Category, Product, CartProduct, Cart, ProductFeature


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductFeature)
admin.site.register(CartProduct)
admin.site.register(Cart)
