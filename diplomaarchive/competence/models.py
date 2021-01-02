from django.db import models
from users.models import User
from course.models import Course

class Competence(models.Model):

    #this has to be unique but the logic is being handled in the serializer
     name = models.CharField(max_length=200)

     def __str__(self):
        return str(self.id) + self.name

class Exemption(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)