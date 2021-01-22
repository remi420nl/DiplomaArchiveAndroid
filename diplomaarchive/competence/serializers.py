from rest_framework import serializers
from .models import Competence, Exemption
from django.core.exceptions import ObjectDoesNotExist


class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = ['id', 'name', 'keyword_set']


class ExemptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exemption
        fields = ['student_id', 'class_id']
