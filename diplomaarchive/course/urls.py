from django.contrib import admin
from django.urls import path, re_path
from .views import CoursesView, LookupCourseBySlug, AddCourse, LookupCourseById

urlpatterns = [
    re_path('(?P<id>\d+)', LookupCourseById.as_view()),
    path('addcourse', AddCourse.as_view()),
    path('', CoursesView.as_view(), name='courses'),

    path('<slug>', LookupCourseBySlug.as_view()),


]
