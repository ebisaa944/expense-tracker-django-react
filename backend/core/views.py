from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from expenses.models import Expense
from incomes.models import Income
from budgets.models import Budget
from goals.models import Goal
from django.utils import timezone

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        # totals
        total_expenses = Expense.objects.filter(user=user, date__gte=start_of_month).aggregate(total=Sum('amount'))['total'] or 0
        total_incomes = Income.objects.filter(user=user, date__gte=start_of_month).aggregate(total=Sum('amount'))['total'] or 0

        # budget alerts (active budgets where spending > limit)
        active_budgets = Budget.objects.filter(user=user, start_date__lte=today, end_date__gte=today)
        budget_alerts = []
        for budget in active_budgets:
            spent = Expense.objects.filter(
                user=user,
                category=budget.category,
                date__range=[budget.start_date, budget.end_date]
            ).aggregate(total=Sum('amount'))['total'] or 0
            if spent > budget.limit_amount:
                budget_alerts.append({
                    'id': budget.id,
                    'category': budget.category.name,
                    'spent': float(spent),
                    'limit': float(budget.limit_amount),
                })

        # goals progress
        goals = Goal.objects.filter(user=user).values('id', 'name', 'target_amount', 'current_amount', 'deadline')

        return Response({
            'total_expenses': float(total_expenses),
            'total_incomes': float(total_incomes),
            'budget_alerts': budget_alerts,
            'goals': list(goals),
        })