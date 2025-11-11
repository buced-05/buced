from django.contrib import admin

from .models import BudgetLine, Mentorship, Milestone


@admin.register(Mentorship)
class MentorshipAdmin(admin.ModelAdmin):
    list_display = ("project", "mentor", "budget_allocated")
    search_fields = ("project__title", "mentor__username")


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("title", "mentorship", "due_date", "is_completed")
    list_filter = ("is_completed",)


@admin.register(BudgetLine)
class BudgetLineAdmin(admin.ModelAdmin):
    list_display = ("label", "mentorship", "amount", "spent")
