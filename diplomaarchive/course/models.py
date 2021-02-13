from django.db import models
from django.utils.text import slugify


class Course(models.Model):
    name = models.CharField(max_length=200, unique=True)
    competences = models.ManyToManyField('competence.Competence')
    description = models.CharField(max_length=800, null=True)
    slug = models.CharField(max_length=200, unique=True, null=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Course, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
