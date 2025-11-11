from rest_framework import permissions, viewsets

from .models import SponsorMessage, SponsorProfile, Sponsorship
from .serializers import (
    SponsorMessageSerializer,
    SponsorProfileSerializer,
    SponsorshipSerializer,
)


class SponsorProfileViewSet(viewsets.ModelViewSet):
    queryset = SponsorProfile.objects.select_related("user").prefetch_related("sponsorships").all()
    serializer_class = SponsorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SponsorshipViewSet(viewsets.ModelViewSet):
    queryset = Sponsorship.objects.select_related("sponsor", "project").all()
    serializer_class = SponsorshipSerializer
    permission_classes = [permissions.IsAuthenticated]


class SponsorMessageViewSet(viewsets.ModelViewSet):
    queryset = SponsorMessage.objects.select_related("sponsorship", "author").all()
    serializer_class = SponsorMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
