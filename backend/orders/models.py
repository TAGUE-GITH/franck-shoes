from django.conf import settings
from django.db import models

from products.models import Product

from .constants import CITY_CHOICES


class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = (
            'PENDING',
            'En attente'
        )

        CONFIRMED = (
            'CONFIRMED',
            'Confirmée'
        )

        PREPARING = (
            'PREPARING',
            'En préparation'
        )

        SHIPPED = (
            'SHIPPED',
            'Expédiée'
        )

        DELIVERED = (
            'DELIVERED',
            'Livrée'
        )

        CANCELLED = (
            'CANCELLED',
            'Annulée'
        )


    class PaymentMethod(models.TextChoices):
        CASH_ON_DELIVERY = (
            'CASH_ON_DELIVERY',
            'Paiement à la livraison'
        )

        MOBILE_MONEY = (
            'MOBILE_MONEY',
            'Mobile Money'
        )


    class PaymentStatus(models.TextChoices):
        PENDING = (
            'PENDING',
            'En attente'
        )

        PAID = (
            'PAID',
            'Payé'
        )

        FAILED = (
            'FAILED',
            'Échec'
        )


    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders'
    )


    first_name = models.CharField(
        max_length=150
    )

    last_name = models.CharField(
        max_length=150
    )

    email = models.EmailField()

    phone = models.CharField(
        max_length=30
    )

    city = models.CharField(
        max_length=100,
        choices=CITY_CHOICES
    )

    address = models.CharField(
        max_length=255
    )

    notes = models.TextField(
        blank=True
    )


    subtotal = models.PositiveIntegerField()

    delivery_fee = models.PositiveIntegerField()

    total = models.PositiveIntegerField()


    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING
    )


    payment_method = models.CharField(
        max_length=30,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH_ON_DELIVERY
    )


    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:
        ordering = [
            '-created_at'
        ]


    def __str__(self):
        return (
            f'Commande #{self.id} - '
            f'{self.first_name} {self.last_name}'
        )


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )


    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )


    product_name = models.CharField(
        max_length=200
    )

    brand = models.CharField(
        max_length=100
    )


    size = models.DecimalField(
        max_digits=4,
        decimal_places=1
    )


    unit_price = models.PositiveIntegerField()

    quantity = models.PositiveIntegerField()

    line_total = models.PositiveIntegerField()


    def __str__(self):
        return (
            f'{self.product_name} '
            f'- {self.size} '
            f'x {self.quantity}'
        )