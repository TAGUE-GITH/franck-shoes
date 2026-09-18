import json

from rest_framework import status

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)

from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)

from rest_framework.permissions import (
    IsAdminUser,
)

from rest_framework.response import Response

from rest_framework.views import APIView


from .models import Product

from .serializers import (
    AdminProductSerializer,
    ProductSerializer,
)


def prepare_product_data(request):
    """
    Transforme les données reçues par Django
    en dictionnaire Python normal.

    C'est particulièrement important pour
    multipart/form-data et les pointures
    envoyées sous forme de JSON.
    """

    data = {}


    simple_fields = [
        'name',
        'brand',
        'price',
        'description',
        'is_active',
    ]


    for field in simple_fields:

        if field in request.data:

            data[field] = request.data.get(
                field
            )


    # =========================
    # IMAGE
    # =========================

    image = request.FILES.get(
        'image'
    )

    if image:
        data['image'] = image


    # =========================
    # POINTURES
    # =========================

    if 'sizes' in request.data:

        raw_sizes = request.data.get(
            'sizes'
        )

        # Avec FormData,
        # sizes arrive comme texte JSON
        if isinstance(
            raw_sizes,
            str
        ):

            try:
                sizes = json.loads(
                    raw_sizes
                )

            except json.JSONDecodeError:

                return None, {
                    'sizes':
                        'Le format des pointures est invalide.'
                }

        else:
            # Cas d'une requête JSON classique
            sizes = raw_sizes


        if not isinstance(
            sizes,
            list
        ):

            return None, {
                'sizes':
                    'Les pointures doivent être une liste.'
            }


        cleaned_sizes = []


        for item in sizes:

            if not isinstance(
                item,
                dict
            ):

                return None, {
                    'sizes':
                        'Une pointure est invalide.'
                }


            if (
                'size' not in item
                or
                'stock' not in item
            ):

                return None, {
                    'sizes':
                        'Chaque pointure doit avoir une taille et un stock.'
                }


            cleaned_sizes.append({
                'size': item['size'],
                'stock': item['stock'],
            })


        data['sizes'] = cleaned_sizes


    return data, None


class ProductListView(
    ListAPIView
):

    serializer_class = (
        ProductSerializer
    )


    def get_queryset(self):

        return (
            Product.objects
            .filter(
                is_active=True
            )
            .prefetch_related(
                'product_sizes'
            )
            .order_by(
                '-created_at'
            )
        )


class ProductDetailView(
    RetrieveAPIView
):

    serializer_class = (
        ProductSerializer
    )


    def get_queryset(self):

        return (
            Product.objects
            .filter(
                is_active=True
            )
            .prefetch_related(
                'product_sizes'
            )
        )


class AdminProductListCreateView(
    APIView
):

    permission_classes = [
        IsAdminUser
    ]


    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


    def get(self, request):

        products = (
            Product.objects
            .prefetch_related(
                'product_sizes'
            )
            .order_by(
                '-created_at'
            )
        )


        serializer = (
            AdminProductSerializer(
                products,
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

        data, error = (
            prepare_product_data(
                request
            )
        )


        if error:

            return Response(
                error,
                status=status.HTTP_400_BAD_REQUEST
            )


        serializer = (
            AdminProductSerializer(
                data=data,
                context={
                    'request': request
                }
            )
        )


        serializer.is_valid(
            raise_exception=True
        )


        product = (
            serializer.save()
        )


        response_serializer = (
            AdminProductSerializer(
                product,
                context={
                    'request': request
                }
            )
        )


        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class AdminProductDetailView(
    APIView
):

    permission_classes = [
        IsAdminUser
    ]


    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]


    def get_object(
        self,
        pk
    ):

        try:

            return (
                Product.objects
                .prefetch_related(
                    'product_sizes'
                )
                .get(
                    pk=pk
                )
            )

        except Product.DoesNotExist:

            return None


    def get(
        self,
        request,
        pk
    ):

        product = self.get_object(
            pk
        )


        if not product:

            return Response(
                {
                    'message':
                        'Produit introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )


        serializer = (
            AdminProductSerializer(
                product,
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

        product = self.get_object(
            pk
        )


        if not product:

            return Response(
                {
                    'message':
                        'Produit introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )


        data, error = (
            prepare_product_data(
                request
            )
        )


        if error:

            return Response(
                error,
                status=status.HTTP_400_BAD_REQUEST
            )


        serializer = (
            AdminProductSerializer(
                product,
                data=data,
                partial=True,
                context={
                    'request': request
                }
            )
        )


        serializer.is_valid(
            raise_exception=True
        )


        product = serializer.save()


        response_serializer = (
            AdminProductSerializer(
                product,
                context={
                    'request': request
                }
            )
        )


        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )


    def delete(
        self,
        request,
        pk
    ):

        product = self.get_object(
            pk
        )


        if not product:

            return Response(
                {
                    'message':
                        'Produit introuvable.'
                },
                status=status.HTTP_404_NOT_FOUND
            )


        if product.image:

            product.image.delete(
                save=False
            )


        product.delete()


        return Response(
            status=status.HTTP_204_NO_CONTENT
        )