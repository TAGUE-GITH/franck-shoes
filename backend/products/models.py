from django.db import models


class Product(models.Model):
    name = models.CharField(
        max_length=200
    )

    brand = models.CharField(
        max_length=100
    )

    price = models.PositiveIntegerField(
        help_text='Prix en FCFA'
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='product_sizes'
    )

    size = models.DecimalField(
        max_digits=4,
        decimal_places=1
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['product', 'size'],
                name='unique_product_size'
            )
        ]

        ordering = ['size']

    def __str__(self):
        return f'{self.product.name} - {self.size}'