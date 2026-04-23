from django.db import models

class TaskExecution(models.Model):
    task_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, default='pending')
    retries = models.IntegerField(default=0)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.task_name} ({self.status})"