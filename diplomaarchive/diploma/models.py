from django.db import models
from users.models import User


class Competence(models.Model):
     name = models.CharField(max_length=200)

class Class(models.Model):
    name = models.CharField(max_length=200)
    competences = models.ManyToManyField(Competence)


class Diploma(models.Model):
     name = models.CharField(max_length=200)
     date = models.DateField()
     student_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Exemption(models.Model):
    student_id = models.ForeignKey(User, on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)