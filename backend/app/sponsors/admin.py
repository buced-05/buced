from django.contrib import admin

from .models import SponsorMessage, SponsorProfile, Sponsorship


@admin.register(SponsorProfile)
class SponsorProfileAdmin(admin.ModelAdmin):
    list_display = ("company", "user", "total_budget")
    search_fields = ("company", "user__username")


@admin.register(Sponsorship)
class SponsorshipAdmin(admin.ModelAdmin):
    list_display = ("sponsor", "project", "amount", "type", "created_at")
    list_filter = ("type",)


@admin.register(SponsorMessage)
class SponsorMessageAdmin(admin.ModelAdmin):
    list_display = ("sponsorship", "author", "created_at")
