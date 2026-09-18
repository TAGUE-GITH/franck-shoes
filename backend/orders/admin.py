from django.contrib import admin

from .models import (
    Order,
    OrderItem,
)


class OrderItemInline(
    admin.TabularInline
):
    model = OrderItem

    extra = 0

    can_delete = False

    readonly_fields = [
        'product',
        'product_name',
        'brand',
        'size',
        'unit_price',
        'quantity',
        'line_total',
    ]


@admin.register(Order)
class OrderAdmin(
    admin.ModelAdmin
):

    list_display = [
        'id',
        'first_name',
        'last_name',
        'phone',
        'city',
        'total',
        'status',
        'payment_status',
        'created_at',
    ]


    list_filter = [
        'status',
        'payment_status',
        'city',
        'created_at',
    ]


    search_fields = [
        'first_name',
        'last_name',
        'email',
        'phone',
    ]


    readonly_fields = [
        'user',
        'subtotal',
        'delivery_fee',
        'total',
        'created_at',
        'updated_at',
    ]


    inlines = [
        OrderItemInline
    ]


@admin.register(OrderItem)
class OrderItemAdmin(
    admin.ModelAdmin
):

    list_display = [
        'order',
        'product_name',
        'size',
        'quantity',
        'line_total',
    ]