from decimal import Decimal

from django.db import transaction

from rest_framework import serializers

from products.models import ProductSize

from .constants import DELIVERY_FEES
from .models import Order, OrderItem


@transaction.atomic
def create_order(
    *,
    user,
    customer_data,
    items_data
):
    if not items_data:
        raise serializers.ValidationError({
            'items':
                'Votre panier est vide.'
        })


    prepared_items = []

    subtotal = 0

    seen_variants = set()


    for item_data in items_data:

        product_id = (
            item_data['product_id']
        )

        size = Decimal(
            str(item_data['size'])
        )

        quantity = (
            item_data['quantity']
        )


        variant_key = (
            product_id,
            size
        )


        if variant_key in seen_variants:
            raise serializers.ValidationError({
                'items':
                    'Une même pointure ne peut pas être envoyée plusieurs fois.'
            })


        seen_variants.add(
            variant_key
        )


        try:
            variant = (
                ProductSize.objects
                .select_for_update()
                .select_related(
                    'product'
                )
                .get(
                    product_id=product_id,
                    size=size,
                    product__is_active=True
                )
            )

        except ProductSize.DoesNotExist:
            raise serializers.ValidationError({
                'items':
                    'Un produit ou une pointure sélectionnée n’existe plus.'
            })


        if quantity <= 0:
            raise serializers.ValidationError({
                'items':
                    'La quantité doit être supérieure à zéro.'
            })


        if quantity > variant.stock:
            raise serializers.ValidationError({
                'items':
                    (
                        f'Stock insuffisant pour '
                        f'{variant.product.name} '
                        f'pointure {variant.size}.'
                    )
            })


        unit_price = (
            variant.product.price
        )

        line_total = (
            unit_price * quantity
        )


        subtotal += (
            line_total
        )


        prepared_items.append({
            'variant': variant,

            'product':
                variant.product,

            'size':
                variant.size,

            'quantity':
                quantity,

            'unit_price':
                unit_price,

            'line_total':
                line_total,
        })


    city = customer_data['city']


    if city not in DELIVERY_FEES:
        raise serializers.ValidationError({
            'city':
                'Cette ville de livraison est invalide.'
        })


    delivery_fee = (
        DELIVERY_FEES[city]
    )


    total = (
        subtotal +
        delivery_fee
    )


    order = Order.objects.create(
        user=user,

        first_name=
            customer_data['first_name'],

        last_name=
            customer_data['last_name'],

        email=
            customer_data['email'],

        phone=
            customer_data['phone'],

        city=city,

        address=
            customer_data['address'],

        notes=
            customer_data.get(
                'notes',
                ''
            ),

        subtotal=subtotal,

        delivery_fee=
            delivery_fee,

        total=total,

        payment_method=
            customer_data.get(
                'payment_method',
                Order.PaymentMethod.CASH_ON_DELIVERY
            )
    )


    for prepared_item in prepared_items:

        variant = (
            prepared_item['variant']
        )


        variant.stock -= (
            prepared_item['quantity']
        )

        variant.save(
            update_fields=[
                'stock'
            ]
        )


        product = (
            prepared_item['product']
        )


        OrderItem.objects.create(
            order=order,

            product=product,

            product_name=
                product.name,

            brand=
                product.brand,

            size=
                prepared_item['size'],

            unit_price=
                prepared_item['unit_price'],

            quantity=
                prepared_item['quantity'],

            line_total=
                prepared_item['line_total'],
        )


    return order