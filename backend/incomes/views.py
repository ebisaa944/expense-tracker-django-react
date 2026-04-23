from .models import Income
from .serializers import IncomeSerializer
from common.viewsets import UserScopedModelViewSet


class IncomeViewSet(UserScopedModelViewSet):
    queryset = Income.objects.select_related('category')
    serializer_class = IncomeSerializer
    ordering = ('-date', '-id')
