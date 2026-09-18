from django.db import transaction

from rest_framework import serializers

from .models import Product, ProductSize


class ProductSizeSerializer(serializers.ModelSerializer):
    size = serializers.FloatField()

    class Meta:
        model = ProductSize

        fields = [
            'id',
            'size',
            'stock',
        ]

        read_only_fields = [
            'id',
        ]


class ProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizeSerializer(
        source='product_sizes',
        many=True,
        read_only=True
    )

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

    def get_stock(self, product):
        return sum(
            product_size.stock
            for product_size
            in product.product_sizes.all()
        )

    def get_image(self, product):
        if not product.image:
            return None

        request = self.context.get(
            'request'
        )

        if request:
            return request.build_absolute_uri(
                product.image.url
            )

        return product.image.url


class AdminProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizeSerializer(
        source='product_sizes',
        many=True,
        required=False
    )

    stock = serializers.SerializerMethodField()

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product

        fields = [
            'id',
            'name',
            'brand',
            'price',
            'description',
            'image',
            'image_url',
            'is_active',
            'stock',
            'sizes',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'image_url',
            'stock',
            'created_at',
            'updated_at',
        ]

        extra_kwargs = {
            'image': {
                'write_only': True,
                'required': False,
                'allow_null': True,
            }
        }

    def get_stock(self, product):
        return sum(
            product_size.stock
            for product_size
            in product.product_sizes.all()
        )

    def get_image_url(self, product):
        if not product.image:
            return None

        request = self.context.get(
            'request'
        )

        if request:
            return request.build_absolute_uri(
                product.image.url
            )

        return product.image.url

    def validate(self, attrs):
        sizes = attrs.get(
            'product_sizes'
        )

        if self.instance is None and not sizes:
            raise serializers.ValidationError({
                'sizes':
                    'Ajoutez au moins une pointure.'
            })

        if sizes is not None:
            existing_sizes = set()

            for item in sizes:
                size = item.get(
                    'size'
                )

                if size in existing_sizes:
                    raise serializers.ValidationError({
                        'sizes':
                            f'La pointure {size} est présente plusieurs fois.'
                    })

                existing_sizes.add(
                    size
                )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        sizes_data = validated_data.pop(
            'product_sizes',
            []
        )

        product = Product.objects.create(
            **validated_data
        )

        for size_data in sizes_data:
            ProductSize.objects.create(
                product=product,
                size=size_data['size'],
                stock=size_data['stock']
            )

        return product

    @transaction.atomic
    def update(
        self,
        instance,
        validated_data
    ):
        sizes_data = validated_data.pop(
            'product_sizes',
            None
        )

        for attribute, value in validated_data.items():
            setattr(
                instance,
                attribute,
                value
            )

        instance.save()

        if sizes_data is not None:
            instance.product_sizes.all().delete()

            for size_data in sizes_data:
                ProductSize.objects.create(
                    product=instance,
                    size=size_data['size'],
                    stock=size_data['stock']
                )

        return instance