from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import Category, Product


class CategorySerializer(ModelSerializer):
    """ Категория """

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    """ Товар """

    class Meta:
        model = Product
        exclude = ('category',)


class CustomCategorySerializer(CategorySerializer):
    """ Категория с товарами """

    products = SerializerMethodField()

    @staticmethod
    def get_products(obj):
        return ProductSerializer(Product.objects.filter(category=obj), many=True).data
