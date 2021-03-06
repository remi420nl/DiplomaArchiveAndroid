from django.db import models
from users.models import User
from course.models import Course


class Competence(models.Model):

    # this has to be unique but the logic is being handled in the serializer
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name


class Exemption(models.Model):
    status_choices = (
        ('a', 'Goedgekeurd'),
        ('r', 'Afgewezen'),
        ('p', 'In Behandeling')
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=1, choices=status_choices, default='p')


class Keyword(models.Model):

    name = models.CharField(max_length=200)
    competence = models.ForeignKey(
        Competence, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return str(self.id) + self.name
