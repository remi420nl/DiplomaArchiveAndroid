from django.contrib import admin
from django.urls import path
from .views import CoursesView, LookupCourse, AddCourse

urlpatterns = [
    path('addcourse', AddCourse.as_view()),
    path('', CoursesView.as_view(), name='classes'),
    path('course/<slug>/', LookupCourse.as_view()),
  
] 
