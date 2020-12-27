from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, logout, get_user_model, login
from django.contrib.auth.models import User

from django.contrib.auth.forms import UserCreationForm
from .forms import CustomForm

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions

from django.contrib.auth.decorators import login_required
from .decorators import unauthenticated_user, allowed_users

from .models import User
from django.contrib.auth.models import Group

@unauthenticated_user
def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)

        if(user is None): return HttpResponse("Unauthorized")
        else:
            login(request,user)
            print(request.user)
            return redirect('/')

        return HttpResponse("Your username is " + username)
    return render(request, 'login.html')

def username(request):
    print(request.user)
    return HttpResponse("Your username is: " + request.user.username)

def logout_user(request):
    logout(request)
    return HttpResponse("User logged out..")

@login_required(login_url='login')
@allowed_users(['student'])
def home(request):
  
    return render(request,'home.html')


@unauthenticated_user
def register(request):
  
    if request.method == 'POST':
        print(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']

        if(username == ""): return HttpResponse("no username!")
        if(password == ""): return HttpResponse("no password!")
        if(email == ""): return HttpResponse("no email!")
        User.objects.create_user(username=username,password=password,email=email)
        user = authenticate(username=username,password=password)
        if(user is None): return HttpResponse("Unauthorized")
        else:
            login(request, user)
            print(request.user)
            return redirect('/')



    return render(request, 'register.html')

class SignupView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data

        
        user_type = 1
        name = data['name']
        email = data['email']
        password = data['password']
        passwordconfirm = data['password2']
        user_type = data['user_type']
        print("type is: " + str(data['user_type']))
        if password == passwordconfirm:
            if User.objects.filter(email=email).exists():
                return Response({'error' : 'Email already exists'})
            else:
                if len(password) < 4:
                    return Response({'error': 'password needs to be at least 4 characters long'})

                else:
                   
                    user = User.objects.create_user(email =email,password=password, name=name)
                    
                    group = Group.objects.get(name='student')
                    user.user_type = user_type
                    user.groups.add(group)
                    user.save()
                    return Response({'success': "user created succesfully"})
        else: 
            return Response({'error': 'passwords dont match'})

