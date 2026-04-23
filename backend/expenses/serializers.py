from rest_framework import serializers
from .models import Expense
from common.serializers import UserOwnedModelSerializer


class ExpenseSerializer(UserOwnedModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'category_name')
