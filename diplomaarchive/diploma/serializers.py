from rest_framework import serializers
from .models import Course,Competence,Diploma,Exemption
from django.core.exceptions import ObjectDoesNotExist
from drf_writable_nested.serializers import WritableNestedModelSerializer
from users.serializers import UserSerializer
from users.models import User

from rest_framework.exceptions import ValidationError

class CompetenceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Competence
		fields=['id','name', 'diploma_set']
		depth = 1


class CourseSerializer(serializers.ModelSerializer):

	competences = CompetenceSerializer(read_only=False, many=True)

	def update(self, instance, validated_data):
		competence = validated_data.pop('competences')
		
		return instance

	class Meta:
		model = Course
		fields=['name', 'competences', 'slug']

class DiplomaSerializer(WritableNestedModelSerializer,serializers.ModelSerializer):
	
	competences = CompetenceSerializer(read_only=False, many=True)
	student = UserSerializer(read_only=True)

	def update(self, instance,validated_data):
		instance.name = validated_data['name']
		instance.date = validated_data['date']

		for competence in validated_data['competences']:
			try:
				c = Competence.objects.get(name = competence['name'])
				
				competence = Competence(id=c.id, name=competence['name'])
		
				print(competence)
				competence.save()
				instance.competences.add(competence)
			except ObjectDoesNotExist:
				
				competence = Competence(name=competence['name'], diploma=instance)
				
				competence.save()
				instance.competences.add(competence)
			
		return instance


	def to_representation(self, instance):
	
		  representation = super(DiplomaSerializer, self).to_representation(instance)
		  representation['student'] = UserSerializer(instance.student).data
		  return representation

	class Meta:
		model = Diploma
		fields=('name', 'date', 'student', 'competences')
		


class ExemptionSerializer(serializers.ModelSerializer):

	class Meta:
		model = Exemption
		fields=['student_id', 'class_id']


