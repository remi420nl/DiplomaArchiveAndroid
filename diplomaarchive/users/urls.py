from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('login', views.login_user, name='login'),
    path('username', views.username),
    path('logout', views.logout_user),
    path('register2', views.SignupView.as_view()),
    path('register', views.register),
    path('home', views.home, name='home'),
   # path('signup/student', views.StudentSignUpView.as_view(), name='student_signup'),
   # path('signup/employer', views.TeacherSignUpView.as_view(), name='employer_signup'),
] 
