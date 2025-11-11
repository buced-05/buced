from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    CustomTokenObtainPairSerializer,
    PasswordChangeSerializer,
    RegisterSerializer,
    TwoFactorToggleSerializer,
    UserSerializer,
)

User = get_user_model()


class IsAdminOrSelf(permissions.BasePermission):
    """Autorise les utilisateurs à accéder à leurs propres données ou les admins."""

    def has_object_permission(self, request, view, obj):
        return bool(request.user and (request.user.is_staff or obj == request.user))


class UserViewSet(viewsets.ModelViewSet):
    """Gestion des utilisateurs (réservé aux administrateurs)."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()
    lookup_field = "id"

    @action(
        detail=False,
        methods=["get", "patch"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def me(self, request):
        if request.method.lower() == "get":
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        serializer_class=PasswordChangeSerializer,
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Mot de passe mis à jour."}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        serializer_class=TwoFactorToggleSerializer,
        permission_classes=[permissions.IsAuthenticated],
    )
    def toggle_2fa(self, request):
        serializer = TwoFactorToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(request.user, serializer.validated_data)
        return Response({"detail": "Mise à jour du statut 2FA réussie."})


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = UserSerializer(user).data
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RefreshTokenView(TokenRefreshView):
    """Rafraîchit les jetons JWT."""


class SessionCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Session valide."}, status=status.HTTP_200_OK)

