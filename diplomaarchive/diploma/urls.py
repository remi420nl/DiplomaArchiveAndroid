from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.static import static

from .views import CoursesView, LookupCourse, DiplomasView, AddDiploma, ExemptionView, AddCourse, CompetencesView, DiplomaView

urlpatterns = [
    path('addcourse', AddCourse.as_view()),
    path('allcourses', CoursesView.as_view(), name='classes'),
    path('course/<slug>/', LookupCourse.as_view()),
    path('alldiplomas', DiplomasView.as_view(), name = 'diplomas'),
    path('adddiploma', AddDiploma.as_view()),
    path('diploma/', DiplomaView.as_view()),
    path('allexemptions', ExemptionView.as_view()),
    path('allcompetences', CompetencesView.as_view(), name ='competences')
] 
