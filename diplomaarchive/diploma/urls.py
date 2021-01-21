from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.static import static
from django.core.exceptions import ObjectDoesNotExist


from .views import DiplomasView, AddDiploma, DiplomaView, ReadDiploma, DiplomasByStudent

urlpatterns = [
    path('diploma/', DiplomaView.as_view()),
    path('byuser', DiplomasByStudent.as_view()),
    path('adddiploma', AddDiploma.as_view()),
    re_path(r'^$', DiplomasView.as_view(), name='diplomas'),
    path('senddiploma', ReadDiploma.as_view())
]
0
