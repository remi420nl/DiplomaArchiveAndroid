from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.conf.urls.static import static

from .views import CoursesView,AddClass, LookupCourse, DiplomasView, AddDiploma, ExemptionView

urlpatterns = [
    path('addcourse', AddClass.as_view()),
    path('allcourses', CoursesView.as_view(), name='classes'),
    path('course/<slug>/', LookupCourse.as_view()),
    path('alldiplomas', DiplomasView.as_view(), name = 'diplomas'),
    path('adddiploma', AddDiploma.as_view()),
    path('allexemptions', ExemptionView.as_view())
] 
