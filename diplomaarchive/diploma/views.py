from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import permissions

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny    

from .models import Course,Competence,Diploma,Exemption
from users.models import User
from rest_framework.decorators import api_view, authentication_classes,permission_classes

from .serializers import CourseSerializer, CompetenceSerializer, DiplomaSerializer, ExemptionSerializer
from datetime import datetime, timezone, timedelta

from rest_framework import permissions


class CoursesView(ListAPIView):

    serializer_class = CourseSerializer

    permission_classes = (AllowAny,)

    def get_queryset(self):
        courses = Course.objects.all()

        return courses

#@apiview(['Post',])
class AddClass(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def post(self, request,format=None, *args, **kwargs):
         data = request.data
         print(data)

         name = data['name']
         slug = data['slug']
         competences = data['competences']

         saved_class = Course.objects.create(name=name, slug=slug)

         for competence in competences:
             if not Competence.objects.filter(name = competence).exists():
                 c = Competence.objects.create(name = competence)
                 saved_class.competences.add(c)
             else:
                 c =  Competence.objects.get(name = competence)
                 saved_class.competences.add(c)
      

         serializer = ClassSerializer(saved_class)

         return Response(serializer.data)

            
class LookupCourse(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'slug'
  
        
class DiplomasView(ListAPIView):

    serializer_class = DiplomaSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        diplomas = Diploma.objects.all()

        print("DIPLOMAS " + str(diplomas))
        serializer = DiplomaSerializer(diplomas, many=True)

        return Response(serializer.data)

class AddDiploma(APIView):
    
    serializer_class = DiplomaSerializer
    permission_classes = (AllowAny,)

    def post(self, request, format = None):
        data = request.data

        name = data['name']
        date = data['date']
        student_id = data['student_id']
        competences = data['competences']

        student = User.objects.get(id = student_id)
        if student.user_type is not 1:
             return Response({"Diploma can only be assigned to a student"})

        saved_diploma = Diploma.objects.create(name=name, date=date,student=student)

        for competence in competences:
           c = Competence.objects.filter(name = competence).exists()
           if c:
               c = Competence.objects.get(name = competence)
               saved_diploma.competences.add(c)
           else:
               c = Competence.objects.create(name = competence)
               saved_diploma.competences.add(c)

        serializer = DiplomaSerializer(saved_diploma)

        return Response(serializer.data)

class ExemptionView(ListAPIView):
      print("start method..")
      serializer_class = ExemptionSerializer

      permission_classes = (AllowAny,)

      def get_queryset(self):
       
          exemptions = Exemption.objects.all()
          print("exemptions" + str(exemptions))

          return exemptions

   
