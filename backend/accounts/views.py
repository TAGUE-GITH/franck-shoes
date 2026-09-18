from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        refresh = RefreshToken.for_user(
            user
        )

        return Response(
            {
                'message':
                    'Compte créé avec succès.',

                'access':
                    str(refresh.access_token),

                'refresh':
                    str(refresh),

                'user':
                    UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = (
            serializer.validated_data['email']
            .lower()
            .strip()
        )

        password = (
            serializer.validated_data['password']
        )

        try:
            user_account = User.objects.get(
                email__iexact=email
            )
        except User.DoesNotExist:
            return Response(
                {
                    'message':
                        'Email ou mot de passe incorrect.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(
            request=request,
            username=user_account.username,
            password=password
        )

        if user is None:
            return Response(
                {
                    'message':
                        'Email ou mot de passe incorrect.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {
                    'message':
                        'Ce compte est désactivé.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(
            user
        )

        return Response({
            'access':
                str(refresh.access_token),

            'refresh':
                str(refresh),

            'user':
                UserSerializer(user).data,
        })


class CurrentUserView(APIView):
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )