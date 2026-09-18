from django.urls import path

from .views import (
    DeliveryFeesView,
    OrderDetailView,
    OrderListCreateView,
)


urlpatterns = [
    path(
        'delivery-fees/',
        DeliveryFeesView.as_view(),
        name='delivery-fees'
    ),

    path(
        '',
        OrderListCreateView.as_view(),
        name='order-list-create'
    ),

    path(
        '<int:pk>/',
        OrderDetailView.as_view(),
        name='order-detail'
    ),
]