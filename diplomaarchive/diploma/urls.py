from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.static import static

from .views import DiplomasView, AddDiploma, DiplomaView, ReadDiploma, DiplomasByStudent

urlpatterns = [
    path('', DiplomasView.as_view(), name='diplomas'),
    path('byuser', DiplomasByStudent.as_view()),
    path('adddiploma', AddDiploma.as_view()),
    path('diploma/', DiplomaView.as_view()),
    path('senddiploma', ReadDiploma.as_view())
]
