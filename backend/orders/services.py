from decimal import Decimal

from django.db import transaction

from rest_framework import serializers

from products.models import ProductSize

from .constants import DELIVERY_FEES
from .models import Order, OrderItem


def restore_order_stock(order):
    for item in order.items.all():

        if item.product_id is None:
            continue

        variant = (
            ProductSize.objects
            .select_for_update()
            .filter(
                product_id=item.product_id,
                size=item.size
            )
            .first()
        )

        if variant:
            variant.stock += item.quantity

            variant.save(
                update_fields=[
                    'stock'
                ]
            )

        else:
            ProductSize.objects.create(
                product_id=item.product_id,
                size=item.size,
                stock=item.quantity
            )


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
                    'Une même pointure ne peut pas apparaître plusieurs fois.'
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
                    'Un produit ou une pointure sélectionnée n’est plus disponible.'
            })

        if quantity <= 0:
            raise serializers.ValidationError({
                'items':
                    'La quantité doit être supérieure à zéro.'
            })

        if quantity > variant.stock:
            raise serializers.ValidationError({
                'items': (
                    f'Stock insuffisant pour '
                    f'{variant.product.name} '
                    f'pointure {variant.size}.'
                )
            })

        unit_price = (
            variant.product.price
        )

        line_total = (
            unit_price *
            quantity
        )

        subtotal += (
            line_total
        )

        prepared_items.append({
            'variant':
                variant,

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

    city = (
        customer_data['city']
    )

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


@transaction.atomic
def cancel_order(
    *,
    order_id,
    user
):
    try:
        order = (
            Order.objects
            .select_for_update()
            .prefetch_related(
                'items'
            )
            .get(
                id=order_id,
                user=user
            )
        )

    except Order.DoesNotExist:
        raise serializers.ValidationError({
            'message':
                'Commande introuvable.'
        })

    cancellable_statuses = {
        Order.Status.PENDING,
        Order.Status.CONFIRMED,
    }

    if order.status not in cancellable_statuses:
        raise serializers.ValidationError({
            'message':
                'Cette commande ne peut plus être annulée.'
        })

    restore_order_stock(
        order
    )

    order.status = (
        Order.Status.CANCELLED
    )

    order.save(
        update_fields=[
            'status',
            'updated_at'
        ]
    )

    return order


@transaction.atomic
def update_order_by_admin(
    *,
    order_id,
    new_status=None,
    new_payment_status=None
):
    try:
        order = (
            Order.objects
            .select_for_update()
            .prefetch_related(
                'items'
            )
            .get(
                id=order_id
            )
        )

    except Order.DoesNotExist:
        raise serializers.ValidationError({
            'message':
                'Commande introuvable.'
        })

    if new_status is not None:

        valid_statuses = {
            value
            for value, _
            in Order.Status.choices
        }

        if new_status not in valid_statuses:
            raise serializers.ValidationError({
                'status':
                    'Statut de commande invalide.'
            })

        if new_status != order.status:

            transitions = {
                Order.Status.PENDING: {
                    Order.Status.CONFIRMED,
                    Order.Status.CANCELLED,
                },

                Order.Status.CONFIRMED: {
                    Order.Status.PREPARING,
                    Order.Status.CANCELLED,
                },

                Order.Status.PREPARING: {
                    Order.Status.SHIPPED,
                },

                Order.Status.SHIPPED: {
                    Order.Status.DELIVERED,
                },

                Order.Status.DELIVERED:
                    set(),

                Order.Status.CANCELLED:
                    set(),
            }

            allowed_statuses = (
                transitions.get(
                    order.status,
                    set()
                )
            )

            if new_status not in allowed_statuses:
                raise serializers.ValidationError({
                    'status': (
                        'Cette transition de statut '
                        'n’est pas autorisée.'
                    )
                })

            if new_status == Order.Status.CANCELLED:
                restore_order_stock(
                    order
                )

            order.status = (
                new_status
            )

    if new_payment_status is not None:

        valid_payment_statuses = {
            value
            for value, _
            in Order.PaymentStatus.choices
        }

        if (
            new_payment_status
            not in valid_payment_statuses
        ):
            raise serializers.ValidationError({
                'payment_status':
                    'Statut de paiement invalide.'
            })

        order.payment_status = (
            new_payment_status
        )

    order.save()

    return order