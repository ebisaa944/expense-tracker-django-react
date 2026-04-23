from .defaults import DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES
from .models import Category


def ensure_default_categories(user):
    for name in DEFAULT_EXPENSE_CATEGORIES:
        Category.objects.get_or_create(
            user=user,
            name=name,
            type='expense',
        )

    for name in DEFAULT_INCOME_CATEGORIES:
        Category.objects.get_or_create(
            user=user,
            name=name,
            type='income',
        )
