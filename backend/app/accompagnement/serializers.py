from rest_framework import serializers

from .models import BudgetLine, Mentorship, Milestone


class BudgetLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetLine
        fields = ["id", "mentorship", "label", "amount", "spent", "created_at"]
        read_only_fields = ["id", "created_at"]


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ["id", "mentorship", "title", "description", "due_date", "is_completed", "progress"]
        read_only_fields = ["id"]


class MentorshipSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    budget_lines = BudgetLineSerializer(many=True, read_only=True)

    class Meta:
        model = Mentorship
        fields = [
            "id",
            "project",
            "mentor",
            "kpis",
            "budget_allocated",
            "notes",
            "milestones",
            "budget_lines",
        ]
        read_only_fields = ["id", "milestones", "budget_lines"]
