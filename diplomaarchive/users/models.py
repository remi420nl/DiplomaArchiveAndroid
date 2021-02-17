from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from datetime import datetime


class UserManager(BaseUserManager):
    def create_user(self, email,name, password=None):
        if not email: 
            raise ValueError("User must have an emailaddress")
        
        email = self.normalize_email(email)
        user = self.model(email=email,name=name)
        user.set_password(password)
        user.save()

        return user
    
    def create_superuser(self, email,name,password):
        user = self.create_user(email,name,password)
        user.is_superuser = True
        user.is_staff = True

        user.save()

        return user



class User(AbstractBaseUser,PermissionsMixin):

    email = models.EmailField(max_length=255,unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    date_created= models.DateTimeField(auto_now_add=True, null = True)
    #overwriting default authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']


    objects = UserManager()

    def __str__(self):
        return self.name


#class Employer(models.Model):
   # user = models.ForeignKey(User, related_name='employer')


#class Student(models.Model):
 #   user = models.ForeignKey(User, related_name='student')