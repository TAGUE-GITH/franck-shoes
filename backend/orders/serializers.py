from rest_framework import serializers

from .constants import CITY_CHOICES
from .models import Order, OrderItem
from .services import create_order


class OrderItemSerializer(
    serializers.ModelSerializer
):

    size = serializers.FloatField()


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
        ]


class OrderSerializer(
    serializers.ModelSerializer
):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )


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
            'payment_method',
            'payment_status',
            'items',
            'created_at',
            'updated_at',
        ]


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
        default=Order.PaymentMethod.CASH_ON_DELIVERY
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