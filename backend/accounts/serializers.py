from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(
        max_length=150
    )

    last_name = serializers.CharField(
        max_length=150
    )

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate_email(self, value):
        email = value.lower().strip()

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise serializers.ValidationError(
                'Un compte existe déjà avec cette adresse email.'
            )

        return email

    def validate_password(self, value):
        validate_password(value)

        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password':
                    'Les mots de passe ne correspondent pas.'
            })

        return data

    def create(self, validated_data):
        validated_data.pop(
            'confirm_password'
        )

        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'role',
        ]

    def get_role(self, user):
        if user.is_staff:
            return 'ADMIN'

        return 'CLIENT'