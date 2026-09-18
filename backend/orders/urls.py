from django.urls import path

from .views import (
    AdminOrderDetailView,
    AdminOrderListView,
    CancelOrderView,
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
        'admin/manage/',
        AdminOrderListView.as_view(),
        name='admin-order-list'
    ),

    path(
        'admin/manage/<int:pk>/',
        AdminOrderDetailView.as_view(),
        name='admin-order-detail'
    ),

    path(
        '',
        OrderListCreateView.as_view(),
        name='order-list-create'
    ),

    path(
        '<int:pk>/cancel/',
        CancelOrderView.as_view(),
        name='order-cancel'
    ),

    path(
        '<int:pk>/',
        OrderDetailView.as_view(),
        name='order-detail'
    ),
]