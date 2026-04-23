from .models import Goal
from common.serializers import UserOwnedModelSerializer


class GoalSerializer(UserOwnedModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
