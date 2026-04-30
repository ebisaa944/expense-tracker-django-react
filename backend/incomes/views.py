from .models import Income
from .serializers import IncomeSerializer
from common.viewsets import UserScopedModelViewSet
from django.db.models import Q


class IncomeViewSet(UserScopedModelViewSet):
    queryset = Income.objects.select_related('category')
    serializer_class = IncomeSerializer
    ordering = ('-date', '-id')

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        category = params.get('category')
        search = params.get('q')
        date_from = params.get('date_from')
        date_to = params.get('date_to')
        min_amount = params.get('min_amount')
        max_amount = params.get('max_amount')
        recurring = params.get('recurring')

        if category:
            queryset = queryset.filter(category_id=category)
        if search:
            queryset = queryset.filter(Q(source__icontains=search) | Q(category__name__icontains=search))
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)
        if recurring in {'true', 'false'}:
            queryset = queryset.filter(is_recurring=(recurring == 'true'))

        return queryset.distinct()
