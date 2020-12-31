from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path

from .views import  ExemptionView, CompetencesView

urlpatterns = [

    path('allexemptions', ExemptionView.as_view()),
    path('allcompetences', CompetencesView.as_view(), name ='competences')
] 
