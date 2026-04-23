from .models import Goal
from .serializers import GoalSerializer
from common.viewsets import UserScopedModelViewSet


class GoalViewSet(UserScopedModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    ordering = ('deadline', 'id')
