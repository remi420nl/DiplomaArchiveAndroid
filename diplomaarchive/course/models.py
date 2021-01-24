from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=200,unique=True)
    competences = models.ManyToManyField('competence.Competence')
    context = models.CharField(max_length=800, null=True)
    slug = models.CharField(max_length=200, unique=True, null = True)

    def __str__(self):
        return self.name