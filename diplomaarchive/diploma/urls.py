from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.conf.urls.static import static

from .views import ClassesView,AddClass, LookupClass

urlpatterns = [
    path('addclass', AddClass.as_view()),
    path('allclasses', ClassesView.as_view(), name='classes'),
    path('class/<slug>/', LookupClass.as_view(), name='classes'),

] 
