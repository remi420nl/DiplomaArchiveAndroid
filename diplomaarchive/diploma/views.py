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
from rest_framework.parsers import FileUploadParser

import pdfplumber
from pathlib import Path
import os


class ExceptionMiddleware(object):

    def process_exception(self, request, exception):
        return Response({'error': True, 'content': exception}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DiplomasView(ListAPIView):

    serializer_class = DiplomaSerializer

    pagination_class = None

    def get_permissions(self):
        if self.request.method == 'GET':

            self.permission_classes = [IsEmployee, ]
            return super(DiplomasView, self).get_permissions()

    def get_queryset(self):
        diplomas = Diploma.objects.all()

        return diplomas


class DiplomasByStudent(ListAPIView):

    serializer_class = DiplomaSerializer

    pagination_class = None

    def get_permissions(self):
        if self.request.method == 'GET':

            self.permission_classes = [IsStudent, ]
            return super(DiplomasByStudent, self).get_permissions()

    def get_queryset(self):

        diplomas = Diploma.objects.filter(student=self.request.user)

        return diplomas


class AddDiploma(APIView):

    parser_class = (FileUploadParser,)
    serializer_class = DiplomaSerializer

    def get_permissions(self):
        if self.request.method == 'POST':

            self.permission_classes = [IsStudent, ]

            return super(AddDiploma, self).get_permissions()

    def post(self, request):

        # student = User.objects.get(id=2)
        # name = "testdiploma"
        # context = "testomschrijving"
        # front_img = request.data['pdf']

        # dic = {
        #     'student':student,
        #     'student_id': 2,
        #     'name' : name,
        #     'context' : context,
        #    ' front_img' : front_img
        #     }

        # diploma = Diploma.objects.create(
        #     name=name, student_id=2,student=student,context=context, front_img=front_img)

        data = request.data
        diploma_name = data['name']

        serializer = DiplomaSerializer(data=data)

        student = request.user

        result = Diploma.objects.filter(
            name=diploma_name).filter(student=student).count()
        if result > 0:

            return Response({"error": "Student heeft al diploma met dezelfde naam"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )

        if(serializer.is_valid()):
            serializer.save(student=student)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

     #####################################################################################
      #  print(request.user.diploma.all())


class DiplomaView(UpdateAPIView):

    # authentication_classes = []

    serializer_class = DiplomaSerializer

    def get(self, request, *args, **kwargs):
        if 'id' in request.GET:

            id = request.query_params["id"]

        try:
            diploma = Diploma.objects.get(id=id)
            is_employee = request.user.groups.filter(name='employee')
            print(is_employee)

            if is_employee:
                print('is employee')

            if diploma.student.id is not request.user.id and not is_employee:

                return Response({'error': 'Unauthorized'}, status=403)
            serializer = DiplomaSerializer(diploma)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        if 'id' in request.GET:
            id = request.query_params["id"]

            try:
                diploma = Diploma.objects.get(id=id)
                serializer = DiplomaSerializer(diploma, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        id = request.query_params["id"]
        try:
            diploma = Diploma.objects.get(id=id)
            diploma.delete()
            return Response(status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ReadDiploma(APIView):

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        BASE_DIR = Path(__file__).resolve().parent.parent

        print("reading diploma..")

        with pdfplumber.open(os.path.join(BASE_DIR, 'media')+"\diplomas\programming job.pdf") as pdf:
            first_page = pdf.pages[0]
            print(first_page.extract_text())
        return Response("Done")
