from django.contrib import admin

from .models import Product, ProductSize


class ProductSizeInline(admin.TabularInline):
    model = ProductSize

    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = [
        'name',
        'brand',
        'price',
        'is_active',
        'created_at',
    ]

    list_filter = [
        'brand',
        'is_active',
    ]

    search_fields = [
        'name',
        'brand',
    ]

    inlines = [
        ProductSizeInline,
    ]


@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):

    list_display = [
        'product',
        'size',
        'stock',
    ]

    list_filter = [
        'size',
    ]

    search_fields = [
        'product__name',
    ]