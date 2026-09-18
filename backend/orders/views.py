from rest_framework import status

from rest_framework.permissions import (
    AllowAny,
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
                'items'
            )
        )


        serializer = (
            OrderSerializer(
                orders,
                many=True
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
                order
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
                        'items'
                    )
                    .get(
                        pk=pk
                    )
                )

            else:

                order = (
                    Order.objects
                    .prefetch_related(
                        'items'
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
                order
            )
        )


        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )