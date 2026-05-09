from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.db.models.functions import TruncDate
from expenses.models import Expense
from incomes.models import Income
from budgets.models import Budget
from goals.models import Goal
from django.utils import timezone
from datetime import timedelta


def month_window(anchor_date):
    start = anchor_date.replace(day=1)
    previous_month_end = start - timedelta(days=1)
    previous_month_start = previous_month_end.replace(day=1)
    return start, previous_month_start, previous_month_end

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        start_of_month, previous_month_start, previous_month_end = month_window(today)

        # totals
        total_expenses = Expense.objects.filter(user=user, date__gte=start_of_month).aggregate(total=Sum('amount'))['total'] or 0
        total_incomes = Income.objects.filter(user=user, date__gte=start_of_month).aggregate(total=Sum('amount'))['total'] or 0
        previous_expenses = Expense.objects.filter(user=user, date__range=[previous_month_start, previous_month_end]).aggregate(total=Sum('amount'))['total'] or 0
        previous_incomes = Income.objects.filter(user=user, date__range=[previous_month_start, previous_month_end]).aggregate(total=Sum('amount'))['total'] or 0

        # budget alerts (active budgets where spending > limit)
        active_budgets = Budget.objects.filter(user=user, start_date__lte=today, end_date__gte=today)
        budget_alerts = []
        budget_statuses = []
        for budget in active_budgets:
            spent = Expense.objects.filter(
                user=user,
                category=budget.category,
                date__range=[budget.start_date, budget.end_date]
            ).aggregate(total=Sum('amount'))['total'] or 0
            percent_used = float((spent / budget.limit_amount) * 100) if budget.limit_amount else 0
            status = 'on_track'
            if spent > budget.limit_amount:
                status = 'over_limit'
                budget_alerts.append({
                    'id': budget.id,
                    'category': budget.category.name,
                    'spent': float(spent),
                    'limit': float(budget.limit_amount),
                })
            elif percent_used >= 80:
                status = 'near_limit'
                budget_alerts.append({
                    'id': budget.id,
                    'category': budget.category.name,
                    'spent': float(spent),
                    'limit': float(budget.limit_amount),
                    'warning': 'Near limit',
                })

            budget_statuses.append({
                'id': budget.id,
                'category': budget.category.name,
                'spent': float(spent),
                'limit': float(budget.limit_amount),
                'remaining': float(max(budget.limit_amount - spent, 0)),
                'percent_used': round(percent_used, 1),
                'status': status,
            })

        # goals progress
        goals = Goal.objects.filter(user=user).values('id', 'name', 'target_amount', 'current_amount', 'deadline')
        current_month_expenses = Expense.objects.filter(user=user, date__gte=start_of_month)
        current_month_incomes = Income.objects.filter(user=user, date__gte=start_of_month)

        category_breakdown = [
            {
                'category': item['category__name'] or 'Uncategorized',
                'amount': float(item['total'] or 0),
            }
            for item in current_month_expenses.values('category__name').annotate(total=Sum('amount')).order_by('-total')
        ]

        top_spending_category = category_breakdown[0] if category_breakdown else None

        trend_start = today - timedelta(days=13)
        expense_trend_map = {
            item['date']: float(item['total'] or 0)
            for item in Expense.objects.filter(user=user, date__range=[trend_start, today])
            .values('date')
            .annotate(total=Sum('amount'))
        }
        income_trend_map = {
            item['date']: float(item['total'] or 0)
            for item in Income.objects.filter(user=user, date__range=[trend_start, today])
            .values('date')
            .annotate(total=Sum('amount'))
        }

        trend = []
        for offset in range(14):
            day = trend_start + timedelta(days=offset)
            trend.append({
                'date': day.isoformat(),
                'expenses': expense_trend_map.get(day, 0),
                'incomes': income_trend_map.get(day, 0),
            })

        def percent_change(current, previous):
            current = float(current or 0)
            previous = float(previous or 0)
            if previous == 0:
                return 100.0 if current > 0 else 0.0
            return round(((current - previous) / previous) * 100, 1)

        savings_rate = 0.0
        if float(total_incomes or 0) > 0:
            savings_rate = round(((float(total_incomes) - float(total_expenses)) / float(total_incomes)) * 100, 1)

        insights = []
        if top_spending_category:
            insights.append(
                f"Top spending category this month is {top_spending_category['category']} at ${top_spending_category['amount']:.2f}."
            )
        insights.append(
            f"Expenses changed by {percent_change(total_expenses, previous_expenses)}% compared with last month."
        )
        insights.append(
            f"Income changed by {percent_change(total_incomes, previous_incomes)}% compared with last month."
        )

        return Response({
            'total_expenses': float(total_expenses),
            'total_incomes': float(total_incomes),
            'previous_total_expenses': float(previous_expenses),
            'previous_total_incomes': float(previous_incomes),
            'expense_change_percent': percent_change(total_expenses, previous_expenses),
            'income_change_percent': percent_change(total_incomes, previous_incomes),
            'savings_rate': savings_rate,
            'budget_alerts': budget_alerts,
            'budget_statuses': budget_statuses,
            'goals': list(goals),
            'category_breakdown': category_breakdown,
            'top_spending_category': top_spending_category,
            'trend': trend,
            'insights': insights,
        })
