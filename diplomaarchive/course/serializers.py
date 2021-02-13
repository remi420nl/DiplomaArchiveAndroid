from rest_framework import serializers
from .models import Course

from competence.serializers import CompetenceSerializer


class CourseSerializer(serializers.ModelSerializer):

    competences = CompetenceSerializer(
        read_only=False, many=True, required=False)

    def update(self, instance, validated_data):
        competence = validated_data.pop('competences')

        return instance

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'competences', 'slug']
