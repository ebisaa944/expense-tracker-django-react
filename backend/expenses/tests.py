import pytest
from rest_framework.test import APIClient
from datetime import date
from expenses.models import Expense
from categories.models import Category
from accounts.models import User

@pytest.mark.django_db
class TestExpensesAPI:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='expenseuser', email='expense@example.com', password='password123')
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(user=self.user, name='Food', type='expense')

    def test_create_expense(self):
        url = '/api/expenses/'
        payload = {
            'category': self.category.id,
            'amount': '50.00',
            'description': 'Groceries',
            'date': str(date.today()),
            'is_recurring': False
        }
        res = self.client.post(url, payload)
        assert res.status_code == 201
        assert Expense.objects.count() == 1

    def test_negative_expense_prevented(self):
        url = '/api/expenses/'
        payload = {
            'category': self.category.id,
            'amount': '-10.00',
            'description': 'Refund?',
            'date': str(date.today()),
            'is_recurring': False
        }
        res = self.client.post(url, payload)
        assert res.status_code == 400
        assert 'amount' in res.data
