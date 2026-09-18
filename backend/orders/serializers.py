from rest_framework import serializers

from .constants import CITY_CHOICES
from .models import Order, OrderItem
from .services import create_order


class OrderItemSerializer(
    serializers.ModelSerializer
):
    size = serializers.FloatField()

    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem

        fields = [
            'id',
            'product',
            'product_name',
            'brand',
            'size',
            'unit_price',
            'quantity',
            'line_total',
            'image',
        ]

    def get_image(
        self,
        item
    ):
        if (
            not item.product
            or
            not item.product.image
        ):
            return None

        request = (
            self.context.get(
                'request'
            )
        )

        if request:
            return request.build_absolute_uri(
                item.product.image.url
            )

        return item.product.image.url


class OrderSerializer(
    serializers.ModelSerializer
):
    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    status_label = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    payment_method_label = serializers.CharField(
        source='get_payment_method_display',
        read_only=True
    )

    payment_status_label = serializers.CharField(
        source='get_payment_status_display',
        read_only=True
    )

    can_cancel = serializers.SerializerMethodField()

    class Meta:
        model = Order

        fields = [
            'id',

            'first_name',
            'last_name',
            'email',
            'phone',

            'city',
            'address',
            'notes',

            'subtotal',
            'delivery_fee',
            'total',

            'status',
            'status_label',

            'payment_method',
            'payment_method_label',

            'payment_status',
            'payment_status_label',

            'can_cancel',

            'items',

            'created_at',
            'updated_at',
        ]

    def get_can_cancel(
        self,
        order
    ):
        return order.status in {
            Order.Status.PENDING,
            Order.Status.CONFIRMED,
        }


class OrderItemCreateSerializer(
    serializers.Serializer
):
    product_id = serializers.IntegerField()

    size = serializers.DecimalField(
        max_digits=4,
        decimal_places=1
    )

    quantity = serializers.IntegerField(
        min_value=1
    )


class OrderCreateSerializer(
    serializers.Serializer
):
    first_name = serializers.CharField(
        max_length=150
    )

    last_name = serializers.CharField(
        max_length=150
    )

    email = serializers.EmailField()

    phone = serializers.CharField(
        max_length=30
    )

    city = serializers.ChoiceField(
        choices=CITY_CHOICES
    )

    address = serializers.CharField(
        max_length=255
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True
    )

    payment_method = serializers.ChoiceField(
        choices=[
            (
                Order.PaymentMethod.CASH_ON_DELIVERY,
                'Paiement à la livraison'
            )
        ],
        default=
            Order.PaymentMethod.CASH_ON_DELIVERY
    )

    items = OrderItemCreateSerializer(
        many=True
    )

    def create(
        self,
        validated_data
    ):
        request = (
            self.context['request']
        )

        items_data = (
            validated_data.pop(
                'items'
            )
        )

        return create_order(
            user=request.user,

            customer_data=
                validated_data,

            items_data=
                items_data
        )