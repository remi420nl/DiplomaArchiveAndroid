from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework import permissions, status


from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny    

from .models import Diploma
from users.models import User
from competence.models import Competence

from .serializers import CourseSerializer, CompetenceSerializer, DiplomaSerializer
from datetime import datetime, timezone, timedelta

from users.permissions import IsEmployee, IsStudent
from rest_framework import permissions


class ExceptionMiddleware(object):

    def process_exception(self, request, exception):
        return Response({'error': True, 'content': exception}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class DiplomasView(ListAPIView):

    serializer_class = DiplomaSerializer
    permission_classes = (AllowAny,)
    pagination_class = None


    def get_queryset(self):
        diplomas = Diploma.objects.all()
      
        return diplomas

class AddDiploma(APIView):
    
    serializer_class = DiplomaSerializer
  

    def get_permissions(self):
        if self.request.method == 'POST':
       
            self.permission_classes = [IsStudent,]
            return super(AddDiploma, self).get_permissions

    def post(self, request, format = None):
        data = request.data

        print(request.user.diploma.all())
        return Response("bla")

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



