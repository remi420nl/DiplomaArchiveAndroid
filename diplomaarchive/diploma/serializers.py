from rest_framework import serializers
from .models import Diploma
from django.core.exceptions import ObjectDoesNotExist
from drf_writable_nested.serializers import WritableNestedModelSerializer
from users.serializers import UserSerializer
from users.models import User
from competence.serializers import CompetenceSerializer
from competence.models import Competence
from course.models import Course

from rest_framework.exceptions import ValidationError


class CourseSerializer(serializers.ModelSerializer):

    competences = CompetenceSerializer(read_only=False, many=True)

    def update(self, instance, validated_data):
        competence = validated_data.pop('competences')

        return instance

    class Meta:
        model = Course
        fields = ['name', 'competences', 'slug']


class DiplomaSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):

    competences = CompetenceSerializer(read_only=False, many=True)
    student = UserSerializer(read_only=True)

    def update(self, instance, validated_data):

        instance.name = validated_data['name']
        instance.date = validated_data['date']

        updated_competences = []
        for x in validated_data['competences']:
            for key, value in x.items():
                updated_competences.append(value)

        for oldcompetence in instance.competences.all():

            if oldcompetence.name not in updated_competences:
                print("competence not found will be deleted..")
                oldcompetence.delete()

        for competence in updated_competences:

            try:

                c = Competence.objects.get(name=competence)

                competence = Competence(id=c.id, name=competence)

                competence.save()
                instance.competences.add(competence)
            except ObjectDoesNotExist:
                print("competence will be created")
                competence = Competence(name=competence, diploma=instance)

                competence.save()
                instance.competences.add(competence)

        return instance

    def to_representation(self, instance):

        representation = super(
            DiplomaSerializer, self).to_representation(instance)
        representation['student'] = UserSerializer(instance.student).data
        return representation

    class Meta:
        model = Diploma
        fields = '__all__'
