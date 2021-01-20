from django.db import models
from users.models import User
from competence.models import Competence


def upload_path(instance, filename):
    print(instance)
    return 'diplomas/%s/%s' % (instance.student.name, filename)


class Diploma(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField(null=True)
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='diploma')
    competences = models.ManyToManyField(Competence, blank=True)
    front_img = models.FileField(upload_to=upload_path, blank=True)
    back_img = models.FileField(upload_to=upload_path, blank=True)
    context = models.TextField(blank=True)

    def __str__(self):
        return self.name
