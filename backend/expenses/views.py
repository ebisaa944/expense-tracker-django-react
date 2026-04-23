from .models import Expense
from .serializers import ExpenseSerializer
from common.viewsets import UserScopedModelViewSet


class ExpenseViewSet(UserScopedModelViewSet):
    queryset = Expense.objects.select_related('category')
    serializer_class = ExpenseSerializer
    ordering = ('-date', '-id')
