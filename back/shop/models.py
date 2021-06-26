from django.db import models


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
    image = models.ImageField(verbose_name='Главное изображение')
    description = models.TextField(verbose_name='Описание')
    price = models.PositiveIntegerField(verbose_name='Цена', default=0)

    def __str__(self):
        return f'{self.title}'

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-id', 'category']


class ProductFeature(models.Model):
    """ Характеристики товара """

    product = models.ForeignKey(Product, verbose_name='Товар', on_delete=models.CASCADE, related_name='features')
    name = models.CharField(max_length=50, verbose_name='Название характеристики')
    feature_value = models.CharField(max_length=50, verbose_name='Значение')
    unit = models.CharField(max_length=20, verbose_name='Единица измерения', blank=True, null=True)

    def __str__(self):
        return f'{self.product.title} - {self.name}'

    class Meta:
        verbose_name = 'Характеристика'
        verbose_name_plural = 'Характеристики'


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
    products = models.ManyToManyField(CartProduct, blank=True, related_name='related_cart')
    total_products = models.PositiveIntegerField(verbose_name='Всего товаров', default=0)
    in_order = models.BooleanField(verbose_name='В заказе корзина?', default=False)
    for_anonymous_user = models.BooleanField(verbose_name='Для анонимных пользователей?', default=False)

    def __str__(self):
        return f'Корзина {self.id}'

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'
