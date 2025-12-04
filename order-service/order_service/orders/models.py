from django.db import models

class Order(models.Model):
    user_id = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    items = models.JSONField()

    class Meta:
        db_table = 'orders'