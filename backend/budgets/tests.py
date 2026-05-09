import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from datetime import date, timedelta
from budgets.models import Budget
from categories.models import Category
from accounts.models import User

@pytest.mark.django_db
class TestBudgetsAPI:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(user=self.user, name='Housing', type='expense')

    def test_create_budget(self):
        url = '/api/budgets/'
        payload = {
            'category': self.category.id,
            'limit_amount': '1500.00',
            'period': 'monthly',
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=30))
        }
        res = self.client.post(url, payload)
        assert res.status_code == 201
        assert Budget.objects.filter(user=self.user).count() == 1

    def test_negative_budget_prevented(self):
        url = '/api/budgets/'
        payload = {
            'category': self.category.id,
            'limit_amount': '-500.00',
            'period': 'monthly',
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=30))
        }
        res = self.client.post(url, payload)
        assert res.status_code == 400
        assert 'limit_amount' in res.data
