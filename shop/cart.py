from django.db.models import Sum, Count

from .models import Cart, CartProduct


def get_cart(user):
    """ Получение или создание корзины """

    if user.is_authenticated:
        cart = Cart.objects.filter(owner=user, in_order=False, for_anonymous_user=False).first()
        if not cart:
            cart = Cart.objects.create(owner=user)
    else:
        cart = Cart.objects.filter(for_anonymous_user=True).first()
        if not cart:
            cart = Cart.objects.create(for_anonymous_user=True)
    return cart


def get_or_create_cart_product(user, cart, product):
    """ Получение или добавление товара в корзину """

    cart_product, created = CartProduct.objects.get_or_create(user=user, cart=cart, product=product)
    return cart_product, created


def recalculate_cart(cart):
    """ Подсчёт количество и стоимости товаров в корзине """

    cart_data = cart.products.aggregate(Sum('final_price'), Count('id'))
    if cart_data.get('final_price__sum'):
        cart.final_price = cart_data['final_price__sum']
    else:
        cart.final_price = 0
    cart.total_products = cart_data['id__count']
    cart.save()
