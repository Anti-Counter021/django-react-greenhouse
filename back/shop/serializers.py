from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import Category, Product, ProductFeature


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

    @staticmethod
    def get_features(obj):
        return FeatureSerializer(ProductFeature.objects.filter(product=obj), many=True).data

    class Meta:
        model = Product
        exclude = ('category',)


class CustomCategorySerializer(CategorySerializer):
    """ Категория с товарами """

    products = SerializerMethodField()
    products_count = SerializerMethodField()

    @staticmethod
    def get_products_count(obj):
        return Product.objects.filter(category=obj).count()

    @staticmethod
    def get_products(obj):
        return ProductSerializer(Product.objects.filter(category=obj), many=True).data
