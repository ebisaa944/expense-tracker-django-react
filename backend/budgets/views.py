from .models import Budget
from .serializers import BudgetSerializer
from common.viewsets import UserScopedModelViewSet


class BudgetViewSet(UserScopedModelViewSet):
    queryset = Budget.objects.select_related('category')
    serializer_class = BudgetSerializer
    ordering = ('-start_date', '-id')
