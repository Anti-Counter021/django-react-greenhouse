from django.contrib import admin

from .models import Category, Product, CartProduct, Cart, ProductFeature, AdditionalImageProduct


admin.site.register(AdditionalImageProduct)
admin.site.register(Cart)
admin.site.register(CartProduct)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductFeature)
