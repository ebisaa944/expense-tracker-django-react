from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User

from .services import ensure_default_categories


@receiver(post_save, sender=User)
def create_default_categories_for_user(sender, instance, created, **kwargs):
    if created:
        ensure_default_categories(instance)
