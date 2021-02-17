from .serializers import CustomTokenObtainPairSerializer
from .serializers import GroupSerializer, UserSerializer, UpdateUserSerializer, ChangePasswordSerializer
from django.contrib.auth.models import Group
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, logout, get_user_model, login
from django.contrib.auth.models import User
from rest_framework.generics import UpdateAPIView
from rest_framework import permissions, status, generics, mixins, permissions
from django.contrib.auth.forms import UserCreationForm
from .forms import CustomForm

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions

from django.contrib.auth.decorators import login_required
from .decorators import unauthenticated_user, allowed_users

from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

User = get_user_model()


class SignupView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        print(data)

        name = data['name']
        email = data['email']
        password = data['password']
        group = data['group']

        if True:
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if len(password) < 4:
                    return Response({'error': 'password needs to be at least 4 characters long'}, status=status.HTTP_400_BAD_REQUEST)

                else:

                    user = User.objects.create_user(
                        email=email, password=password, name=name)

                    user.groups.add(group['id'])
                    user.save()

                    serializer = UserSerializer(user)
                    return Response({'message': "user created succesfully",
                                     'user': serializer.data
                                     })

    def get(self, request, format=None):

        # to return the groups to the client
        groups = Group.objects.all()

        serializer = GroupSerializer(groups, many=True)
        return Response({'groups': serializer.data})


class CustomTokenObtainPairView(TokenObtainPairView):

    serializer_class = CustomTokenObtainPairSerializer


class UpdateUserProfileView(UpdateAPIView):

    serializer_class = UpdateUserSerializer

    def get_object(self):
        obj = self.request.user

        return obj


class UpdateUserPasswordView(UpdateAPIView):

    serializer_class = ChangePasswordSerializer

    def get_object(self):
        print(self.request.data)
        obj = self.request.user

        return obj
