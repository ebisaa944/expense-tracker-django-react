from rest_framework import serializers
from .models import Income
from common.serializers import UserOwnedModelSerializer


class IncomeSerializer(UserOwnedModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'category_name')

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value
