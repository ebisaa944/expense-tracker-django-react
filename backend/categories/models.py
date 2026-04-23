from django.db import models
from accounts.models import User

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    CATEGORY_TYPE_CHOICES = (('income', 'Income'), ('expense', 'Expense'))
    type = models.CharField(max_length=7, choices=CATEGORY_TYPE_CHOICES)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.name} ({self.type})"