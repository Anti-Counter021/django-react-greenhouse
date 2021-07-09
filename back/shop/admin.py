from django.contrib import admin

from .models import (
    Category,
    Product,
    CartProduct,
    Cart,
    ProductFeature,
    AdditionalImageProduct,
    Order,
    Review,
    Feedback,
)


class ProductFeatureInline(admin.TabularInline):
    """ Характеристики для редактора товаров """

    model = ProductFeature


class AdditionalImageProductInline(admin.TabularInline):
    """ Дополнительные изображения для редактора товаров """

    model = AdditionalImageProduct


class CategoryAdmin(admin.ModelAdmin):
    """ Категории """

    def has_delete_permission(self, request, obj=None):
        return False

    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


class CartAdmin(admin.ModelAdmin):
    """ Корзина """

    def has_delete_permission(self, request, obj=None):
        return False

    list_display = ('id', 'owner', 'total_products', 'final_price', 'in_order', 'for_anonymous_user')
    list_display_links = ('owner',)
    list_filter = ('owner',)
    empty_value_display = 'unknown'
    search_fields = ('owner__username',)
    fields = ('owner', 'products', ('total_products', 'final_price'), ('in_order', 'for_anonymous_user'))


class CartProductAdmin(admin.ModelAdmin):
    """ Товары в корзине """

    def has_delete_permission(self, request, obj=None):
        return False

    list_display = ('cart', 'user', 'product', 'qty', 'price', 'final_price')
    list_display_links = ('cart', 'user', 'product')
    search_fields = ('cart__id', 'user__username', 'product__title')


class FeedbackAdmin(admin.ModelAdmin):
    """ Обратная связь (ошибки) """

    @admin.action(description='Статус выбранных записей в "Исправлено"')
    def fix_action(self, request, queryset):
        queryset.update(status='fix')

    list_display = ('text', 'status', 'created_at')
    list_display_links = ('text',)
    list_filter = ('status',)
    search_fields = ('text',)
    list_editable = ('status',)
    actions = (fix_action,)


class ProductAdmin(admin.ModelAdmin):
    """ Товары """

    def price_with_discount(self, product):
        return f'{product.get_price_with_discount()}'

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description='Поставка выбранных товаров прекращена')
    def delivery_terminated_action_true(self, request, queryset):
        queryset.update(delivery_terminated=True)

    @admin.action(description='Поставка выбранных товаров возобновилась')
    def delivery_terminated_action_false(self, request, queryset):
        queryset.update(delivery_terminated=False)

    @admin.action(description='Скидки закончились для выбранных товаров')
    def stop_discount_action(self, request, queryset):
        queryset.update(discount=0)

    price_with_discount.short_description = 'Цена со скидкой'

    list_display = ('category', 'title', 'price', 'discount', 'price_with_discount', 'delivery_terminated')
    list_display_links = ('category', 'title')
    list_editable = ('delivery_terminated', 'discount')
    list_filter = ('delivery_terminated', 'discount')
    search_fields = ('title', 'category__name', 'price_with_discount', 'discount')
    fields = (
        'category', ('title', 'slug'), 'description', 'image', 'price', 'discount', 'delivery_terminated', 'features'
    )
    prepopulated_fields = {'slug': ('title',)}
    inlines = (AdditionalImageProductInline, ProductFeatureInline)
    actions = (delivery_terminated_action_true, delivery_terminated_action_false, stop_discount_action)


class ProductFeatureAdmin(admin.ModelAdmin):
    """ Характеристики """

    list_display = ('product', 'name', 'feature_value', 'unit')
    search_fields = ('name', 'product__title')


class ReviewAdmin(admin.ModelAdmin):
    """ Отзывы """
    
    @admin.action(description='Выбранные записи изменят свои оценки на максимальные (нежелательно)')
    def max_appraisal_action(self, request, queryset):
        queryset.update(appraisal=5)

    list_display = ('user', 'appraisal', 'created_at')
    list_editable = ('appraisal',)
    list_filter = ('appraisal',)
    search_fields = ('user__username',)
    actions = (max_appraisal_action,)


admin.site.register(Category, CategoryAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartProduct, CartProductAdmin)
admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductFeature, ProductFeatureAdmin)
admin.site.register(Review, ReviewAdmin)

admin.site.register(Order)
