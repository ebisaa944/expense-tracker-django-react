from rest_framework import serializers
from .models import Income

class IncomeSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'category_name')