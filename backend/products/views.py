from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView
)

from .models import Product
from .serializers import ProductSerializer


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .prefetch_related('product_sizes')
            .order_by('-created_at')
        )


class ProductDetailView(RetrieveAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .prefetch_related('product_sizes')
        )