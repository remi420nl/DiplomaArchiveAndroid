from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, re_path

from .views import ExemptionView, ExemptionsView, CompetencesView, CompetenceView, CompetenceUpdateView, KeywordsView, ApprovedExemptions

urlpatterns = [

    path('allcompetences/', CompetencesView.as_view(), name='competences'),
    path('competences/', CompetenceView.as_view(), name='competence'),
    path('updatecompetence/', CompetenceUpdateView.as_view(), name='competence'),
    path('allexemptions/', ExemptionsView.as_view()),
    path('exemption/', ExemptionView.as_view()),
    path('keywords/<int:id>', KeywordsView.as_view()),
    path('testt/<int:id>', ApprovedExemptions.as_view()),


]
