from django.shortcuts import render
from users.models import User
from .models import Course
from competence.models import Competence
from .serializers import CourseSerializer
from rest_framework.permissions import AllowAny 
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

class CoursesView(ListAPIView):

    serializer_class = CourseSerializer

    permission_classes = (AllowAny,)
    pagination_class = None

    def get_queryset(self):
        courses = Course.objects.all()

        return courses


class AddCourse(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def post(self, request,format=None, *args, **kwargs):
         data = request.data
         print(data)
         serializer = CourseSerializer(data = data)
         if serializer.is_valid(raise_exception=True):
             name = data['name']
             slug = data['slug']
             competences = data['competences']

             saved_course = Course.objects.create(name=name, slug=slug)

             for competence in competences:
                  key,value = competence.popitem()
                  if not Competence.objects.filter(name = value).exists():
                      c = Competence.objects.create(name = value)
                      saved_course.competences.add(c)
                  else:
                      c =  Competence.objects.get(name = value)
                      saved_course.competences.add(c)
      

         
             return Response(serializer.data, status=status.HTTP_201_CREATED)

            
class LookupCourse(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'slug'
  