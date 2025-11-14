from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)
    cover_photo = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "establishment",
            "avatar",
            "cover_photo",
            "bio",
            "phone_number",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "establishment",
        ]

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("L'adresse e-mail est obligatoire.")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Cette adresse e-mail est déjà utilisée.")
        return value.lower()

    def validate_username(self, value):
        # Si username n'est pas fourni ou vide, on le génère à partir de l'email
        if not value or value.strip() == "":
            return None
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.get("email", "").lower()
        
        # Générer username à partir de l'email si non fourni
        if not validated_data.get("username"):
            base_username = email.split("@")[0]
            username = base_username
            counter = 1
            while User.objects.filter(username__iexact=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            validated_data["username"] = username
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personnalisé pour accepter email au lieu de username"""
    username_field = None
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email et mot de passe sont requis.")

        # Essayer de trouver l'utilisateur par email
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Identifiants invalides.")
        
        # Authentifier avec le username et le password
        authenticated_user = authenticate(username=user.username, password=password)
        
        if not authenticated_user:
            raise serializers.ValidationError("Identifiants invalides.")
        
        if not authenticated_user.is_active:
            raise serializers.ValidationError("Ce compte est désactivé.")
        
        # Utiliser la méthode parente pour générer les tokens
        refresh = self.get_token(authenticated_user)
        data = {}
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        return data
