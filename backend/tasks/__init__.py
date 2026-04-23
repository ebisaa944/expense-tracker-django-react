from celery import shared_task
from budgets.models import Budget
from expenses.models import Expense
from django.db.models import Sum
from django.utils import timezone

@shared_task
def check_budget_alerts():
    """
    Check all active budgets and log/alert if the user exceeded the limit.
    """
    today = timezone.now().date()
    budgets = Budget.objects.filter(start_date__lte=today, end_date__gte=today)
    for budget in budgets:
        total_expenses = Expense.objects.filter(
            user=budget.user,
            category=budget.category,
            date__range=[budget.start_date, budget.end_date]
        ).aggregate(total=Sum('amount'))['total'] or 0

        if total_expenses > budget.limit_amount:
            # In a real app you would send an email or push notification
            print(f"Budget exceeded! User: {budget.user.username}, "
                  f"Category: {budget.category.name}, "
                  f"Spent: {total_expenses}, Limit: {budget.limit_amount}")