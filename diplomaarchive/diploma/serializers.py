from rest_framework import serializers
from .models import Course,Competence,Diploma,Exemption



class CompetenceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Competence
		fields=['name']


class CourseSerializer(serializers.ModelSerializer):

	competences = CompetenceSerializer(read_only=False, many=True)

	def update(self, instance, validated_data):
		competence = validated_data.pop('competences')
		
		return instance

	class Meta:
		model = Course
		fields=['name', 'competences', 'slug']

class DiplomaSerializer(serializers.ModelSerializer):

	competences = CompetenceSerializer(read_only=False, many=True)

	class Meta:
		model = Diploma
		fields=['name', 'date', 'student', 'competences']

class ExemptionSerializer(serializers.ModelSerializer):

	class Meta:
		model = Exemption
		fields=['student_id', 'class_id']


