from rest_framework import serializers
from .models import User
from django.contrib.auth.models import Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta():
        model = User
        fields = ['id', 'name', 'email']


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


# Adding data to login response (tokens)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)

        groups = Group.objects.filter(user=self.user)

        serializer = GroupSerializer(groups, many=True)
        user = {
            'name': self.user.name,
            'type': serializer.data[0]['name']
        }
        data.update({'user': user})

        return data
