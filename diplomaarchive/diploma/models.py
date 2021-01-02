from django.db import models
from users.models import User
from competence.models import Competence


class Diploma(models.Model):
     name = models.CharField(max_length=200)
     date = models.DateField()
     student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diploma')
     competences = models.ManyToManyField(Competence)
     front_img = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
     back_img = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)

     def __str__(self):
        return self.name
