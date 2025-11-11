from __future__ import annotations

from rest_framework import serializers

from .models import Dataset, MLModel, PredictionLog


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ("id", "model_type", "version", "hyperparameters", "metrics", "storage_path", "status", "created_at")
        read_only_fields = ("id", "created_at")


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ("id", "name", "description", "version", "records", "metadata", "created_at")
        read_only_fields = ("id", "created_at")


class PredictionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionLog
        fields = ("id", "model", "input_payload", "output_payload", "duration_ms", "success", "created_at")
        read_only_fields = ("id", "created_at")

