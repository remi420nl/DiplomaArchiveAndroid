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
            'email': self.user.email,
            'type': serializer.data[0]['name']
        }
        data.update({'user': user})

        return data


class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('email', 'name')

    def validate_email(self, value):
        print("validating email")
        user = self.context['request'].user
        if User.objects.exclude(id=user.id).filter(email=value).exists():
            print("email in use..")
            raise serializers.ValidationError(
                {"error": "email is already in use."})
        return value

    def update(self, instance, validated_data):
        instance.email = validated_data['email']
        instance.name = validated_data['name']
        instance.save()

        return instance


class ChangePasswordSerializer(serializers.ModelSerializer):
    oldpassword = serializers.CharField(write_only=True, required=True, )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('oldpassword', 'password')

    def validate_oldpassword(self, value):
    
        user = self.context['request'].user
        if not user.check_password(value):
        
            raise serializers.ValidationError(
                {"error": "old password not correct"})
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance
