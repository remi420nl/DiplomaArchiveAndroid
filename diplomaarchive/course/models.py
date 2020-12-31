from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=200,unique=True)
    competences = models.ManyToManyField('competence.Competence')
    slug = models.CharField(max_length=200, unique=True, null = True)

    def __str__(self):
        return self.name