from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework import permissions, status


from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny    

from .models import Course,Competence,Diploma,Exemption
from users.models import User
from rest_framework.decorators import api_view, authentication_classes,permission_classes

from .serializers import CourseSerializer, CompetenceSerializer, DiplomaSerializer, ExemptionSerializer
from datetime import datetime, timezone, timedelta

from rest_framework import permissions


class ExceptionMiddleware(object):

    def process_exception(self, request, exception):
        return Response({'error': True, 'content': exception}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CoursesView(ListAPIView):

    serializer_class = CourseSerializer

    permission_classes = (AllowAny,)

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

        student_id = data['student']
        diploma = data['name']
        date = data['date']

        student = User.objects.get(id = student_id)
      

        if student.user_type is not 1:
             return Response({"error": "Diploma can only be assigned to a student"},
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR
                             )


        result = Diploma.objects.filter(name = diploma).filter(student = student).count()
        if result > 0:

            return Response({"error" : "student already has this diploma assigned"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )

 
        diploma = Diploma.objects.create(name = diploma, student = student, date = date)
      

        for competence in data['competences']:
       
            try:
                c = Competence.objects.get(name = competence['name'])
                diploma.competences.add(c)
            except ObjectDoesNotExist:
                c = Competence.objects.create(name = competence['name'])
                diploma.competences.add(c)
	  
        
        serializer = DiplomaSerializer(diploma)
     
        return Response(serializer.data, status=status.HTTP_201_CREATED)
 
class DiplomaView(UpdateAPIView):

    authentication_classes = []

    serializer_class = DiplomaSerializer
    permission_classes = (AllowAny,)

    def get(self,request, *args, **kwargs):
        id = request.query_params["id"]

        try:
            diploma = Diploma.objects.get(id = id)
            serializer = DiplomaSerializer(diploma)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
    
        id = request.query_params["id"]

        try:
            diploma = Diploma.objects.get(id = id)
            serializer = DiplomaSerializer(diploma, data = request.data)
            if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        id = request.query_params["id"]
        try:
            diploma = Diploma.objects.get(id = id)
            diploma.delete()
            return Response(status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)



class ExemptionView(ListAPIView):
    
      serializer_class = ExemptionSerializer

      permission_classes = (AllowAny,)

      def get_queryset(self):
       
          exemptions = Exemption.objects.all()
          print("exemptions" + str(exemptions))

          return exemptions

   
class CompetencesView(ListAPIView):

    serializer_class = CompetenceSerializer
    queryset = Competence.objects.all()
    permission_classes = (AllowAny,)