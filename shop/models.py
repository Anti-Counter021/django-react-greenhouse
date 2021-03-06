from datetime import datetime

from django.db import models

from .utils import get_timestamp_path


class Category(models.Model):
    """ Категории """

    name = models.CharField(max_length=50, verbose_name='Название категории')
    slug = models.SlugField(unique=True, verbose_name='URL категории')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class Product(models.Model):
    """ Товары """

    category = models.ForeignKey(Category, verbose_name='Категория', on_delete=models.PROTECT, related_name='products')
    title = models.CharField(max_length=50, verbose_name='Название товара')
    slug = models.SlugField(unique=True, verbose_name='URL товара')
    image = models.ImageField(verbose_name='Главное изображение', upload_to=get_timestamp_path)
    description = models.TextField(verbose_name='Описание')
    price = models.PositiveIntegerField(verbose_name='Цена', default=0)
    discount = models.PositiveIntegerField(verbose_name='Скидка', default=0)
    delivery_terminated = models.BooleanField(verbose_name='Поставка товара прекращена', default=False)
    features = models.ManyToManyField(
        'ProductFeature', verbose_name='Характеристики', blank=True, related_name='features_for_product'
    )

    def __str__(self):
        return f'{self.title}'

    def get_price_with_discount(self):
        return self.price - self.price / 100 * self.discount

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['category', 'price', '-id']


class ProductFeature(models.Model):
    """ Характеристики товара """

    product = models.ForeignKey(
        Product, verbose_name='Товар', on_delete=models.CASCADE, related_name='related_features'
    )
    name = models.CharField(max_length=50, verbose_name='Название характеристики')
    feature_value = models.CharField(max_length=50, verbose_name='Значение')
    unit = models.CharField(max_length=20, verbose_name='Единица измерения', blank=True, null=True)

    def __str__(self):
        return f'{self.product.title} - {self.name}'

    class Meta:
        verbose_name = 'Характеристика'
        verbose_name_plural = 'Характеристики'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.features.add(self)


class AdditionalImageProduct(models.Model):
    """ Дополнительные изображения товара """

    product = models.ForeignKey(
        Product, verbose_name='Товар', on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(verbose_name='Дополнительное изображение', upload_to=get_timestamp_path)

    def __str__(self):
        return f'{self.product.title} - Изображение'

    class Meta:
        verbose_name = 'Дополнительное изображение'
        verbose_name_plural = 'Дополнительные изображения'


class CartProduct(models.Model):
    """ Товар в корзине """

    user = models.ForeignKey('accounts.User', verbose_name='Покупатель', on_delete=models.CASCADE)
    cart = models.ForeignKey('Cart', verbose_name='Корзина', on_delete=models.CASCADE, related_name='related_products')
    qty = models.PositiveIntegerField(verbose_name='Количество', default=1)
    product = models.ForeignKey(Product, verbose_name='Товар', on_delete=models.CASCADE)
    price = models.PositiveIntegerField(verbose_name='Цена товара', default=0)
    final_price = models.PositiveIntegerField(verbose_name='Общая цена', default=0)

    def __str__(self):
        return f'{self.product.title} в количестве {self.qty}'

    def save(self, *args, **kwargs):
        self.final_price = self.qty * self.price
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Товар в корзине'
        verbose_name_plural = 'Товары в корзинах'


class Cart(models.Model):
    """ Корзина """

    owner = models.ForeignKey('accounts.User', verbose_name='Владелец', on_delete=models.CASCADE, null=True)
    products = models.ManyToManyField(CartProduct, verbose_name='Товары', blank=True, related_name='related_cart')
    total_products = models.PositiveIntegerField(verbose_name='Всего товаров', default=0)
    in_order = models.BooleanField(verbose_name='В заказе корзина?', default=False)
    final_price = models.PositiveIntegerField(verbose_name='Общая цена', default=0)
    for_anonymous_user = models.BooleanField(verbose_name='Для анонимных пользователей?', default=False)

    def __str__(self):
        return f'Корзина {self.id}'

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'


class Order(models.Model):
    """ Заказы """

    BUYING_TYPE_SELF = 'Самовывоз'
    BUYING_TYPE_DELIVERY = 'Доставка'

    BUYING_TYPE_CHOICES = (
        (BUYING_TYPE_SELF, 'Самовывоз'),
        (BUYING_TYPE_DELIVERY, 'Доставка'),
    )

    STATUS_NEW = 'new'
    STATUS_COMPLETED = 'completed'

    STATUS_CHOICES = (
        (STATUS_NEW, 'Новый'),
        (STATUS_COMPLETED, 'Выполнен')
    )

    user = models.ForeignKey(
        'accounts.User', verbose_name='Покупатель', on_delete=models.CASCADE, related_name='related_orders'
    )
    first_name = models.CharField(max_length=255, verbose_name='Имя')
    last_name = models.CharField(max_length=255, verbose_name='Фамилия')
    phone = models.CharField(max_length=30, verbose_name='Телефон')
    cart = models.ForeignKey(Cart, verbose_name='Корзина', on_delete=models.CASCADE)
    address = models.CharField(max_length=255, verbose_name='Адрес')
    buying_type = models.CharField(
        max_length=50, verbose_name='Тип заказа', choices=BUYING_TYPE_CHOICES, default=BUYING_TYPE_SELF
    )
    comment = models.TextField(verbose_name='Комментарий', null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True, verbose_name='Дата оформления заказа')
    order_date = models.DateField(verbose_name='Дата для получения заказа', default=datetime.utcnow(), db_index=True)
    status = models.CharField(max_length=40, verbose_name='Статус заказа', choices=STATUS_CHOICES, default=STATUS_NEW)

    def __str__(self):
        return f'{self.user.username} - {self.cart} - заказ № {self.id}'

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']


class Review(models.Model):
    """ Отзывы """

    APPRAISAL_CHOICES = (
        (1, 'Очень плохо'),
        (2, 'Плохо'),
        (3, 'Нормально'),
        (4, 'Хорошо'),
        (5, 'Великолепно!'),
    )

    user = models.ForeignKey(
        'accounts.User', verbose_name='Пользователь', on_delete=models.CASCADE, related_name='appraisal'
    )
    appraisal = models.PositiveIntegerField(verbose_name='Оценка', choices=APPRAISAL_CHOICES)
    comment = models.CharField(max_length=200, verbose_name='Комментарий')
    created_at = models.DateTimeField(auto_now=True, verbose_name='Дата создания отзыва')

    def __str__(self):
        return f'{self.get_appraisal_display()} - {self.user}'

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['appraisal', '-created_at']


class Feedback(models.Model):
    """ Сообщение о багах """

    NEW = 'new'
    FIX = 'fix'

    STATUS_CHOICES = (
        (NEW, 'Новый'),
        (FIX, 'Исправлен'),
    )

    text = models.TextField(verbose_name='Описание проблемы')
    status = models.CharField(max_length=30, verbose_name='Статус ошибки', choices=STATUS_CHOICES, default=NEW)
    created_at = models.DateTimeField(auto_now=True, verbose_name='Дата поступления проблемы')

    def __str__(self):
        return f'{self.id} - {self.get_status_display()}'

    class Meta:
        verbose_name = 'Ошибка'
        verbose_name_plural = 'Ошибки'
        ordering = ['-status', '-created_at']
