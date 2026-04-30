from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    @property
    def full_name(self):
        name = f'{self.first_name} {self.last_name}'.strip()
        return name or self.username


class UserSettings(models.Model):
    CURRENCY_CHOICES = (
        ('ETB', 'Ethiopian Birr'),
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
    )
    THEME_CHOICES = (
        ('light', 'Light'),
        ('dark', 'Dark'),
    )
    FONT_FAMILY_CHOICES = (
        ('inter', 'Inter'),
        ('poppins', 'Poppins'),
    )
    FONT_SIZE_CHOICES = (
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    )
    DASHBOARD_VIEW_CHOICES = (
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    )
    CHART_TYPE_CHOICES = (
        ('bar', 'Bar'),
        ('pie', 'Pie'),
        ('line', 'Line'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='ETB')
    theme_mode = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    font_family = models.CharField(max_length=10, choices=FONT_FAMILY_CHOICES, default='inter')
    font_size = models.CharField(max_length=10, choices=FONT_SIZE_CHOICES, default='medium')
    primary_color = models.CharField(max_length=20, default='indigo')
    compact_tables = models.BooleanField(default=False)
    dashboard_default_view = models.CharField(max_length=10, choices=DASHBOARD_VIEW_CHOICES, default='monthly')
    dashboard_chart_type = models.CharField(max_length=10, choices=CHART_TYPE_CHOICES, default='line')
    dashboard_show_income_expense_chart = models.BooleanField(default=True)
    dashboard_show_budget_summary = models.BooleanField(default=True)
    dashboard_show_top_categories = models.BooleanField(default=True)
    notifications_budget_alerts = models.BooleanField(default=True)
    notifications_goal_reminders = models.BooleanField(default=True)
    notifications_low_balance = models.BooleanField(default=True)
    budget_threshold = models.PositiveSmallIntegerField(default=80)
    export_data_ready = models.BooleanField(default=False)
    google_oauth_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Settings for {self.user.username}'
