from django.contrib import admin
from django.urls import path
from .views import CoursesView, LookupCourseBySlug, AddCourse, LookupCourseById

urlpatterns = [
    path('addcourse', AddCourse.as_view()),
    path('', CoursesView.as_view(), name='courses'),

    path('<id>', LookupCourseById.as_view()),
    path('<slug>', LookupCourseBySlug.as_view()),

]
