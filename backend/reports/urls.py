from django.urls import path
from .views import ExportExpensesCSVView

urlpatterns = [
    path('export/expenses/', ExportExpensesCSVView.as_view(), name='export_expenses_csv'),
]
