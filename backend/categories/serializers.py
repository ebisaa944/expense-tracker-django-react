from .models import Category
from common.serializers import UserOwnedModelSerializer


class CategorySerializer(UserOwnedModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('user',)
