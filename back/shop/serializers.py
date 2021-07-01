from rest_framework.serializers import ModelSerializer, SerializerMethodField

from accounts.serializers import UserSerializer

from .models import (
    Category,
    Product,
    ProductFeature,
    AdditionalImageProduct,
    CartProduct,
    Cart,
    Order,
    Review,
    Feedback,
)


class AdditionalImageProductSerializer(ModelSerializer):
    """ Дополнительные изображения товара """

    class Meta:
        model = AdditionalImageProduct
        fields = ('image', 'id')


class FeatureSerializer(ModelSerializer):
    """ Характеристика """

    class Meta:
        model = ProductFeature
        exclude = ('product',)


class CategorySerializer(ModelSerializer):
    """ Категория """

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    """ Товар """

    features = SerializerMethodField()
    additional_images = SerializerMethodField()
    count_images = SerializerMethodField()
    price_with_discount = SerializerMethodField()

    @staticmethod
    def get_price_with_discount(obj):
        return obj.get_price_with_discount()

    @staticmethod
    def get_count_images(obj):
        return obj.images.count() + 1

    @staticmethod
    def get_features(obj):
        return FeatureSerializer(ProductFeature.objects.filter(product=obj), many=True).data

    @staticmethod
    def get_additional_images(obj):
        return AdditionalImageProductSerializer(AdditionalImageProduct.objects.filter(product=obj), many=True).data

    class Meta:
        model = Product
        exclude = ('category',)


class CustomCategorySerializer(CategorySerializer):
    """ Категория с товарами """

    products = SerializerMethodField()
    products_count = SerializerMethodField()

    @staticmethod
    def get_products_count(obj):
        return Product.objects.filter(category=obj, delivery_terminated=False).count()

    @staticmethod
    def get_products(obj):
        return ProductSerializer(Product.objects.filter(category=obj, delivery_terminated=False), many=True).data


class ProductMinSerializer(ModelSerializer):
    """ Минимально о товаре """

    class Meta:
        model = Product
        exclude = ('category', 'slug', 'description')


class CartProductSerializer(ModelSerializer):
    """ Товары в корзине """

    product = ProductMinSerializer()

    class Meta:
        model = CartProduct
        exclude = ('user', 'cart')


class CartSerializer(ModelSerializer):
    """ Корзина """

    products = SerializerMethodField()
    owner = UserSerializer()

    @staticmethod
    def get_products(obj):
        return CartProductSerializer(CartProduct.objects.filter(cart=obj), many=True).data

    class Meta:
        model = Cart
        fields = '__all__'


class OrderSerializer(ModelSerializer):
    """ Заказы """

    cart = SerializerMethodField()

    @staticmethod
    def get_cart(obj):
        return CartSerializer(Cart.objects.filter(order=obj).first()).data

    class Meta:
        model = Order
        exclude = ('user',)


class ReviewSerializer(ModelSerializer):
    """ Отзывы """

    user = SerializerMethodField()

    @staticmethod
    def get_user(obj):
        return obj.user.username

    class Meta:
        model = Review
        fields = '__all__'


class FeedbackSerializer(ModelSerializer):
    """ Сообщение о багах """

    class Meta:
        model = Feedback
        fields = ('text',)
