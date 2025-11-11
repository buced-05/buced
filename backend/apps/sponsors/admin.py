from __future__ import annotations

from django.contrib import admin

from .models import EngagementReport, SponsorMessage, SponsorProfile, Sponsorship


@admin.register(SponsorProfile)
class SponsorProfileAdmin(admin.ModelAdmin):
    list_display = ("company_name", "user", "budget_total", "created_at")
    search_fields = ("company_name", "user__email")
    autocomplete_fields = ("user",)


@admin.register(Sponsorship)
class SponsorshipAdmin(admin.ModelAdmin):
    list_display = ("project", "sponsor", "commitment_type", "amount", "status")
    list_filter = ("commitment_type", "status")
    search_fields = ("project__title", "sponsor__company_name")
    raw_id_fields = ("project", "sponsor")


@admin.register(SponsorMessage)
class SponsorMessageAdmin(admin.ModelAdmin):
    list_display = ("sponsorship", "sender", "created_at")
    raw_id_fields = ("sponsorship", "sender")


@admin.register(EngagementReport)
class EngagementReportAdmin(admin.ModelAdmin):
    list_display = ("sponsorship", "period_start", "period_end", "created_at")
    raw_id_fields = ("sponsorship",)

