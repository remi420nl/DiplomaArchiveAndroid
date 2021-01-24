from rest_framework import serializers
from .models import Competence, Exemption
from django.core.exceptions import ObjectDoesNotExist
from users.serializers import UserSerializer


class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = ['id', 'name', 'keyword_set']


class ExemptionSerializer(serializers.ModelSerializer):
    student = UserSerializer()

    class Meta:
        model = Exemption
        fields = ['student', 'course_id']
