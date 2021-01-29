from rest_framework import serializers
from .models import Competence, Exemption
from django.core.exceptions import ObjectDoesNotExist
from users.serializers import UserSerializer


class ChoiceField(serializers.ChoiceField):

    def to_representation(self, obj):

        if obj == '' and self.allow_blank:
            return obj
        return self._choices[obj]

# def to_internal_value(self, data):

#     if data == '' and self.allow_blank:
#         return ''

#     for key, val in self._choices.items():
#         if val == data:
#             return key
#     self.fail('invalid_choice', input=data)


class CompetenceSerializer(serializers.ModelSerializer):

    match = serializers.SerializerMethodField()

    class Meta:

        model = Competence
        fields = ['id', 'name', 'keyword_set', 'match']

    def get_match(self, obj):

        if hasattr(obj, 'match'):
            if obj.match:
                return True
        else:
            return False


class ExemptionSerializer(serializers.ModelSerializer):
    course = serializers.SerializerMethodField()
    student = UserSerializer()
    status = ChoiceField(choices=Exemption.status_choices)

    class Meta:
        model = Exemption
        fields = ['id', 'student', 'course', 'status']

    def get_course(self, obj):
        return {'name': obj.course.name, 'id': obj.course.id}


class ExemptionUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exemption
        exclude = ('student', 'course')
