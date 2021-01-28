from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, re_path

from .views import ExemptionView, ExemptionsView, CompetencesView, CompetenceView

urlpatterns = [

    path('allexemptions/', ExemptionsView.as_view()),
    path('allcompetences/', CompetencesView.as_view(), name='competences'),
    path('exemption/', ExemptionView.as_view()),
    path('competence/', CompetenceView.as_view(), name='competence')

]
