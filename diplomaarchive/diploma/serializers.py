from rest_framework import serializers
from .models import Class,Competence,Diploma,Exemption



class CompetenceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Competence
		fields=['name']


class ClassSerializer(serializers.ModelSerializer):

	competences = CompetenceSerializer(read_only=False, many=True)


	def update(self, instance, validated_data):
		competence = validated_data.pop('competences')
		print("UPDATE: " + str(competence))
		return instance

	class Meta:
		model = Class
		fields=['name', 'competences', 'slug']

class DiplomaSerializer(serializers.ModelSerializer):
	class Meta:
		model = Diploma
		fields=['name', 'date', 'student_id']

class ExemptionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Exemption
		fields=['student_id', 'class_id']