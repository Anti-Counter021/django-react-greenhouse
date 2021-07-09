from datetime import datetime

from rest_framework import serializers

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


class AdditionalImageProductSerializer(serializers.ModelSerializer):
    """ Дополнительные изображения товара """

    class Meta:
        model = AdditionalImageProduct
        fields = ('image', 'id')


class FeatureSerializer(serializers.ModelSerializer):
    """ Характеристика """

    class Meta:
        model = ProductFeature
        exclude = ('product',)


class CategorySerializer(serializers.ModelSerializer):
    """ Категория """

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    """ Товар """

    features = serializers.SerializerMethodField()
    additional_images = serializers.SerializerMethodField()
    count_images = serializers.SerializerMethodField()
    price_with_discount = serializers.SerializerMethodField()

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

    products = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()

    @staticmethod
    def get_products_count(obj):
        return Product.objects.filter(category=obj, delivery_terminated=False).count()

    @staticmethod
    def get_products(obj):
        return ProductSerializer(Product.objects.filter(category=obj, delivery_terminated=False), many=True).data


class ProductMinSerializer(serializers.ModelSerializer):
    """ Минимально о товаре """

    class Meta:
        model = Product
        exclude = ('category', 'description', 'features')


class CartProductSerializer(serializers.ModelSerializer):
    """ Товары в корзине """

    product = ProductMinSerializer()

    class Meta:
        model = CartProduct
        exclude = ('user', 'cart')


class CartSerializer(serializers.ModelSerializer):
    """ Корзина """

    products = serializers.SerializerMethodField()
    owner = UserSerializer()

    @staticmethod
    def get_products(obj):
        return CartProductSerializer(CartProduct.objects.filter(cart=obj), many=True).data

    class Meta:
        model = Cart
        fields = '__all__'


class CreateOrderSerializer(serializers.ModelSerializer):
    """ Заказы """

    cart = serializers.SerializerMethodField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField(max_length=30)
    address = serializers.CharField(max_length=300)
    buying_type = serializers.CharField(max_length=30)
    comment = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    order_date = serializers.DateField(format='%d/%m/%Y', input_formats=['%d/%m/%Y'])

    def validate(self, data):
        if data['buying_type'] not in ('Самовывоз', 'Доставка'):
            raise serializers.ValidationError({'error': 'Неправильный тип заказа!'})

        if data['order_date'] < datetime.today().date():
            raise serializers.ValidationError({'error': 'Желаемая дата получения не может быть прошедшей!'})

        return data

    def create(self, validated_data):
        return Order.objects.create(**validated_data)

    @staticmethod
    def get_cart(obj):
        return CartSerializer(Cart.objects.filter(order=obj).first()).data

    class Meta:
        model = Order
        exclude = ('user',)


class CreateReviewSerializer(serializers.ModelSerializer):
    """ Отзывы """

    user = serializers.SerializerMethodField()
    appraisal = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=200, required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        return Review.objects.create(**validated_data)

    @staticmethod
    def get_user(obj):
        return obj.user.username

    class Meta:
        model = Review
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    """ Сообщение о багах """

    class Meta:
        model = Feedback
        fields = ('text',)
