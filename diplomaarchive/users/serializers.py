from rest_framework import serializers
from .models import User
from django.contrib.auth.models import Group


class UserSerializer(serializers.ModelSerializer):

    class Meta():
        model = User
        fields = ['id','name', 'email']


class GroupSerializer(serializers.ModelSerializer):

    value = serializers.SerializerMethodField('get_dutch_translation')

    class Meta():
        model = Group
        fields = ['id', 'name', 'value']

    def get_dutch_translation(self, group):
        if group.name == "employee":
            return "Medewerker"
        if group.name == "student":
            return "Student"
