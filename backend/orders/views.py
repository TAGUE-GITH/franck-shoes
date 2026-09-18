from rest_framework import status

from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
    IsAuthenticated,
)

from rest_framework.response import Response

from rest_framework.views import APIView


from .constants import DELIVERY_FEES

from .models import Order

from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
)

from .services import (
    cancel_order,
    update_order_by_admin,
)


class DeliveryFeesView(APIView):

    permission_classes = [
        AllowAny
    ]

    def get(
        self,
        request
    ):
        return Response(
            DELIVERY_FEES,
            status=status.HTTP_200_OK
        )


class OrderListCreateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):
        orders = (
            Order.objects
            .filter(
                user=request.user
            )
            .prefetch_related(
                'items__product'
            )
        )

        serializer = (
            OrderSerializer(
                orders,
                many=True,
                context={
                    'request': request
                }
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(
        self,
        request
    ):
        serializer = (
            OrderCreateSerializer(
                data=request.data,
                context={
                    'request': request
                }
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = (
            serializer.save()
        )

        response_serializer = (
            OrderSerializer(
                order,
                context={
                    'request': request
                }
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class OrderDetailView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        pk
    ):
        try:

            if request.user.is_staff:

                order = (
                    Order.objects
                    .prefetch_related(
                        'items__product'
                    )
                    .get(
                        pk=pk
                    )
                )

            else:

                order = (
                    Order.objects
                    .prefetch_related(
                        'items__product'
                    )
                    .get(
                        pk=pk,
                        user=request.user
                    )
                )

        except Order.DoesNotExist:

            return Response(
                {
                    'message':
                        'Commande introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = (
            OrderSerializer(
                order,
                context={
                    'request': request
                }
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class CancelOrderView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        pk
    ):
        order = cancel_order(
            order_id=pk,
            user=request.user
        )

        serializer = (
            OrderSerializer(
                order,
                context={
                    'request': request
                }
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class AdminOrderListView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def get(
        self,
        request
    ):
        orders = (
            Order.objects
            .select_related(
                'user'
            )
            .prefetch_related(
                'items__product'
            )
            .order_by(
                '-created_at'
            )
        )

        serializer = (
            OrderSerializer(
                orders,
                many=True,
                context={
                    'request': request
                }
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class AdminOrderDetailView(APIView):

    permission_classes = [
        IsAdminUser
    ]

    def get(
        self,
        request,
        pk
    ):
        try:
            order = (
                Order.objects
                .select_related(
                    'user'
                )
                .prefetch_related(
                    'items__product'
                )
                .get(
                    pk=pk
                )
            )

        except Order.DoesNotExist:
            return Response(
                {
                    'message':
                        'Commande introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = (
            OrderSerializer(
                order,
                context={
                    'request': request
                }
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(
        self,
        request,
        pk
    ):
        new_status = (
            request.data.get(
                'status'
            )
        )

        new_payment_status = (
            request.data.get(
                'payment_status'
            )
        )

        if (
            new_status is None
            and
            new_payment_status is None
        ):
            return Response(
                {
                    'message':
                        'Aucune modification fournie.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order = update_order_by_admin(
            order_id=pk,
            new_status=new_status,
            new_payment_status=
                new_payment_status
        )

        serializer = (
            OrderSerializer(
                order,
                context={
                    'request': request
                }
            )
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )