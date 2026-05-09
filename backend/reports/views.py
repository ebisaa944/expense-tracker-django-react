import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from expenses.models import Expense

class ExportExpensesCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="expenses.csv"'

        writer = csv.writer(response)
        writer.writerow(['Date', 'Category', 'Amount', 'Description'])

        expenses = Expense.objects.filter(user=request.user).select_related('category').order_by('-date')
        for expense in expenses:
            writer.writerow([
                expense.date,
                expense.category.name if expense.category else 'Uncategorized',
                expense.amount,
                expense.description
            ])

        return response
