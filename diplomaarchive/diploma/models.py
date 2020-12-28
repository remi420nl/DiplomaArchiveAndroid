from django.db import models
from users.models import User

class Competence(models.Model):
     name = models.CharField(max_length=200, unique=True)

     def __str__(self):
        return self.name

class Course(models.Model):
    name = models.CharField(max_length=200,unique=True)
    competences = models.ManyToManyField(Competence)
    slug = models.CharField(max_length=200, unique=True, null = True)

    def __str__(self):
        return self.name

class Diploma(models.Model):
     name = models.CharField(max_length=200)
     date = models.DateField()
     student = models.ForeignKey(User, on_delete=models.CASCADE)
     competences = models.ManyToManyField(Competence)

class Exemption(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)