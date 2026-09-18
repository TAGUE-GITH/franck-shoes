from django.urls import path

from .views import (
    AdminProductDetailView,
    AdminProductListCreateView,
    ProductDetailView,
    ProductListView,
)


urlpatterns = [
    path(
        '',
        ProductListView.as_view(),
        name='product-list'
    ),

    path(
        '<int:pk>/',
        ProductDetailView.as_view(),
        name='product-detail'
    ),

    path(
        'admin/manage/',
        AdminProductListCreateView.as_view(),
        name='admin-product-list-create'
    ),

    path(
        'admin/manage/<int:pk>/',
        AdminProductDetailView.as_view(),
        name='admin-product-detail'
    ),
]