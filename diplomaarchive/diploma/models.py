from django.db import models
from users.models import User


class Competence(models.Model):
     name = models.CharField(max_length=200, unique=True)

     def __str__(self):
        return self.name

class Class(models.Model):
    name = models.CharField(max_length=200,unique=True)
    competences = models.ManyToManyField(Competence)
    slug = models.CharField(max_length=200, unique=True, null = True)

    def __str__(self):
        return self.name

class Diploma(models.Model):
     name = models.CharField(max_length=200)
     date = models.DateField()
     student_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Exemption(models.Model):
    student_id = models.ForeignKey(User, on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)