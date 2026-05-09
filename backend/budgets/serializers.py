from rest_framework import serializers
from .models import Budget
from common.serializers import UserOwnedModelSerializer


class BudgetSerializer(UserOwnedModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ('user', 'category_name')

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({"end_date": "End date must be after start date."})
            
        limit_amount = data.get('limit_amount')
        if limit_amount is not None and limit_amount <= 0:
            raise serializers.ValidationError({"limit_amount": "Budget limit must be greater than zero."})
            
        return data
