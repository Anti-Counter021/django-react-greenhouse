from datetime import datetime

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from accounts.models import User

from .models import *
from .cart import recalculate_cart


class ShopModelTestCase(TestCase):
    """ Тесты моделей основного приложения """

    def create_cart_product(self):
        self.cart_product = CartProduct.objects.create(
            product=self.product, user=self.user, price=self.product.price, qty=2, cart=self.cart,
        )
        self.cart.products.add(self.cart_product)
        recalculate_cart(self.cart)

    def setUp(self) -> None:
        self.user = User.objects.create_user(username='test', password='password', email='test@example.com')
        self.category = Category.objects.create(name='Greenhouses', slug='greenhouse')
        self.product = Product.objects.create(
            category=self.category,
            title='Greenhouse Botan',
            slug='greenhouse-botan',
            image=SimpleUploadedFile('greenhouse_image.png', content=b'', content_type='image/png'),
            description='New product Greenhouse Botan!',
            price=35000,
        )
        self.cart = Cart.objects.create(owner=self.user)

    def test_product(self):
        self.assertEqual(self.category.products.count(), 1)
        self.assertEqual(self.category.products.first(), self.product)
        self.assertEqual(self.product.category, self.category)
        self.product.discount = 10
        self.product.save()
        self.assertEqual(
            self.product.get_price_with_discount(),
            self.product.price - self.product.price / 100 * self.product.discount,
        )
        self.assertEqual(self.product in self.category.products.all(), True)
        self.product.delivery_terminated = True
        self.product.save()
        self.assertEqual(self.product in Product.objects.filter(delivery_terminated=False), False)

    def test_product_feature(self):
        self.product_feature = ProductFeature.objects.create(
            product=self.product, name='Width', feature_value='3', unit='m',
        )
        self.assertEqual(self.product.features.first(), self.product_feature)
        self.assertEqual(self.product.features.count(), 1)
        self.assertEqual(self.product_feature in self.product.features.all(), True)

    def test_additional_images(self):
        additionalImage = AdditionalImageProduct.objects.create(
            product=self.product,
            image=SimpleUploadedFile('greenhouse_image.png', content=b'', content_type='image/png'),
        )
        self.assertEqual(self.product.images.first(), additionalImage)
        self.assertEqual(self.product.images.count(), 1)
        self.assertEqual(additionalImage in self.product.images.all(), True)

    def test_empty_cart(self):
        self.assertEqual(self.cart.owner, self.user)
        self.assertEqual(self.cart.products.count(), 0)
        self.assertEqual(self.cart.final_price, 0)
        self.assertEqual(self.cart.total_products, 0)

    def test_add_to_cart(self):
        self.create_cart_product()
        self.assertEqual(self.cart_product.product, self.product)
        self.assertEqual(self.user, self.cart_product.user)
        self.assertEqual(self.user, self.cart_product.cart.owner)
        self.assertEqual(self.cart_product.qty, 2)
        self.assertEqual(self.cart_product.final_price, self.product.price * self.cart_product.qty)
        self.assertEqual(self.cart_product.final_price, self.cart_product.price * self.cart_product.qty)
        self.assertEqual(self.cart.products.count(), 1)
        self.assertEqual(self.cart_product in self.cart.products.all(), True)
        self.assertEqual(self.cart.final_price, self.cart_product.final_price)
        self.assertEqual(self.cart.total_products, self.cart.products.count())

    def test_change_qty_from_cart(self):
        self.create_cart_product()
        self.cart_product.qty = 3
        self.cart_product.save()
        self.assertEqual(self.cart_product.qty, 3)
        self.assertEqual(self.cart_product.final_price, self.cart_product.price * 3)
        self.assertEqual(self.cart_product.final_price, self.cart_product.product.price * 3)
        recalculate_cart(self.cart)
        self.assertEqual(self.cart.final_price, self.cart_product.final_price)

    def test_remove_from_cart(self):
        self.create_cart_product()
        self.cart.products.remove(self.cart_product)
        self.cart_product.delete()
        recalculate_cart(self.cart)
        self.assertEqual(self.cart.final_price, 0)
        self.assertEqual(self.cart.products.count(), 0)
        self.assertEqual(self.cart.total_products, 0)
        self.assertEqual(CartProduct.objects.filter(user=self.user).count(), 0)

    def test_order(self):
        self.create_cart_product()
        order = Order.objects.create(
            user=self.user,
            first_name='Arkady',
            last_name='Kounter',
            phone='88005553535',
            address='Backer Street',
            cart=self.cart,
            comment='Please need fast',
        )
        self.cart.in_order = True
        self.cart.save()
        self.user.orders.add(order)
        self.user.save()
        self.assertEqual(self.user.orders.first(), order)
        self.assertEqual(self.user.orders.count(), 1)
        self.assertEqual(self.cart.in_order, True)
        self.assertEqual(order.cart, self.cart)
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.buying_type, Order.BUYING_TYPE_SELF)
        self.assertEqual(order.order_date.date(), datetime.utcnow().date())

    def test_review(self):
        review = Review.objects.create(user=self.user, appraisal=3, comment='Very good site!')
        self.assertEqual(review.user, self.user)
        self.assertEqual(review.get_appraisal_display(), 'Нормально')

    def test_feedback(self):
        feedback = Feedback.objects.create(text='I have a bug! No work on site "products cart"!')
        self.assertEqual(feedback.status, Feedback.NEW)


class ShopAPITestCase(APITestCase):
    """ Тесты представлений основного приложения """

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')

    def create_cart_product(self):
        self.cart_product = CartProduct.objects.create(
            product=self.product, user=self.user, price=self.product.price, qty=1, cart=self.cart,
        )
        self.cart.products.add(self.cart_product)
        recalculate_cart(self.cart)

    def setUp(self) -> None:
        self.user = User.objects.create_user(username='test', password='password', email='test@example.com')
        self.category = Category.objects.create(name='Greenhouses', slug='greenhouse')
        self.product = Product.objects.create(
            category=self.category,
            title='Greenhouse Botan',
            slug='greenhouse-botan',
            image=SimpleUploadedFile('greenhouse_image.png', content=b'', content_type='image/png'),
            description='New product Greenhouse Botan!',
            price=35000,
        )
        self.cart = Cart.objects.create(owner=self.user)
        self.review = Review.objects.create(user=self.user, appraisal=3, comment='Very good site!')

        self.categories_url = reverse('shop:categories')
        self.products_url = reverse('shop:products')
        self.product_detail_url = reverse('shop:product_detail', kwargs={'slug': self.product.slug})
        self.new_product_url = reverse('shop:new')
        self.reviews_url = reverse('shop:reviews')
        self.feedback_url = reverse('shop:feedback')
        self.cart_base_url = '/api/cart/'
        self.cart_url = self.cart_base_url + 'get/'
        self.add_to_cart_url = self.cart_base_url + f'add/{self.product.id}/'
        self.change_qty_url = self.cart_base_url + 'change-qty/'
        self.remove_from_cart_url = self.cart_base_url + 'remove/'
        self.make_order_url = reverse('shop:orders')

        self.token = Token.objects.create(user=self.user)
        self.api_authentication()

    def test_categories_auth(self):
        response = self.client.get(self.categories_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["name"], self.category.name)

    def test_categories_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.categories_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["name"], self.category.name)

    def test_product_auth(self):
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["title"], self.product.title)

    def test_product_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["title"], self.product.title)

    def test_product_detail_auth(self):
        response = self.client.get(self.product_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.product.title)

    def test_product_detail_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.product_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.product.title)

    def test_new_product_auth(self):
        response = self.client.get(self.new_product_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.product.title)

    def test_new_product_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.new_product_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.product.title)

    def test_reviews_auth(self):
        response = self.client.get(self.reviews_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["appraisal"], self.review.appraisal)

    def test_reviews_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.reviews_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["appraisal"], self.review.appraisal)

    def test_create_review_auth(self):
        response = self.client.post(self.reviews_url, {'appraisal': 3, 'comment': 'Very good site!'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'detail': 'Спасибо за отзыв!'})

    def test_create_review_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.reviews_url, {'appraisal': 3, 'comment': 'Very good site!'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Чтобы оставить отзыв необходимо быть авторизованным!'})

    def test_create_feedback_auth(self):
        response = self.client.post(self.feedback_url, {'text': 'I have a bug!'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_feedback_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.feedback_url, {'text': 'I have a bug!'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cart_auth(self):
        response = self.client.get(self.cart_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["for_anonymous_user"], False)

    def test_cart_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.cart_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["for_anonymous_user"], True)

    def test_add_to_cart_auth(self):
        response = self.client.post(self.add_to_cart_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'detail': 'Товар добавлен в корзину', 'added': True})
        self.assertEqual(self.cart.products.count(), 1)

        response = self.client.post(self.add_to_cart_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'detail': 'Товар уже в корзине', 'added': False})
        self.assertEqual(self.cart.products.count(), 1)

    def test_add_to_cart_un_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.add_to_cart_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Необходимо авторизироваться!'})

    def test_change_qty_auth_owner(self):
        self.create_cart_product()
        response = self.client.put(self.change_qty_url + f'{self.cart_product.id}' + f'/{3}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                'detail': 'Количество товара успешно изменено',
                'final_price': response.data['final_price'], 'cart_price': response.data['cart_price'],
            }
        )

    def test_change_qty_auth_other(self):
        self.create_cart_product()
        self.client.force_authenticate(user=User.objects.create_user('admin1', 'password'))
        response = self.client.put(self.change_qty_url + f'{self.cart_product.id}' + f'/{3}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Вы не имеете права изменять что-то не в своей корзине!'})

    def test_change_qty_un_auth(self):
        self.create_cart_product()
        self.client.force_authenticate(user=None)
        response = self.client.put(self.change_qty_url + f'{self.cart_product.id}' + f'/{3}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Необходимо авторизироваться!'})

    def test_remove_from_cart_auth_owner(self):
        self.create_cart_product()
        response = self.client.delete(self.remove_from_cart_url + f'{self.cart_product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'detail': 'Товар успешно удалён'})

    def test_remove_from_cart_auth_other(self):
        self.create_cart_product()
        self.client.force_authenticate(user=User.objects.create_user('admin1', 'password'))
        response = self.client.delete(self.remove_from_cart_url + f'{self.cart_product.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Вы не имеете права удалять что-то не в своей корзине!'})

    def test_remove_from_cart_un_auth(self):
        self.create_cart_product()
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.remove_from_cart_url + f'{self.cart_product.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, {'error': 'Необходимо авторизироваться!'})

    def test_make_order_auth(self):
        self.create_cart_product()
        response = self.client.post(
            self.make_order_url,
            {
                'first_name': 'Arkady',
                'last_name': 'Kounter',
                'phone': '88005553535',
                'address': 'Backer Street',
                'comment': 'Please need fast',
                'buying_type': 'Самовывоз',
                'order_date': '25/08/2022'
            }
        )
        self.assertEqual(response.data, {'detail': 'Заказ создан успешно. Ждите ответа'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_make_order_un_auth(self):
        self.create_cart_product()
        self.client.force_authenticate(user=None)
        response = self.client.post(
            self.make_order_url,
            {
                'first_name': 'Arkady',
                'last_name': 'Kounter',
                'phone': '88005553535',
                'address': 'Backer Street',
                'comment': 'Please need fast',
                'buying_type': 'Самовывоз',
                'order_date': '25/08/2022'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
