from rest_framework import serializers
from .models import Budget
from common.serializers import UserOwnedModelSerializer


class BudgetSerializer(UserOwnedModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ('user', 'category_name')
