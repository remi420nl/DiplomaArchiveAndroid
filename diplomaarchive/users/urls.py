from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.conf.urls.static import static

from .views import UpdateUserProfileView,UpdateUserPasswordView, SignupView

urlpatterns = [
    path('register2', SignupView.as_view()),
    path('updateprofile',UpdateUserProfileView.as_view(), name='update_profile'),
     path('updatepassword', UpdateUserPasswordView.as_view(), name='change_password'),
] 
