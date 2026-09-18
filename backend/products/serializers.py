from rest_framework import serializers

from .models import Product, ProductSize


class ProductSizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductSize

        fields = [
            'size',
            'stock',
        ]


class ProductSerializer(serializers.ModelSerializer):

    sizes = serializers.SerializerMethodField()

    stock = serializers.SerializerMethodField()

    image = serializers.SerializerMethodField()

    class Meta:
        model = Product

        fields = [
            'id',
            'name',
            'brand',
            'price',
            'description',
            'image',
            'stock',
            'sizes',
        ]

    def get_sizes(self, product):
        return [
            float(product_size.size)
            for product_size
            in product.product_sizes.all()
            if product_size.stock > 0
        ]

    def get_stock(self, product):
        return sum(
            product_size.stock
            for product_size
            in product.product_sizes.all()
        )

    def get_image(self, product):
        if not product.image:
            return None

        request = self.context.get('request')

        if request:
            return request.build_absolute_uri(
                product.image.url
            )

        return product.image.url