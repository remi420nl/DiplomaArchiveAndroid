from django.db import models
from datetime import datetime


class Contact(models.Model):
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=100)
    subject = models.CharField(max_length=200)
    message = models.TextField(blank=True)
    date = models.DateTimeField(default=datetime.now, blank=True)
    
    def __str(self):
        return self.email
    
    