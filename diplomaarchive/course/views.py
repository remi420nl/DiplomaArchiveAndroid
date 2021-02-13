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
from users.decorators import allowed_users
from users.permissions import IsEmployee, IsStudent


class CoursesView(ListAPIView):

    serializer_class = CourseSerializer

    permission_classes = (AllowAny,)
    pagination_class = None

    # def get_permissions(self):
    #     if self.request.method == 'GET' or self.request.method == 'POST':

    #         self.permission_classes = [IsStudent,]
    #         return super(CoursesView, self).get_permissions()

    def get_queryset(self):

        name = self.request.query_params.get('name', None)

        if name:

            courses = Course.objects.filter(name__contains=name)
            return courses

        courses = Course.objects.all()

        return courses


class AddCourse(APIView):

    permission_classes = (AllowAny,)

    def post(self, request, format=None, *args, **kwargs):
        try:
            data = request.data

            serializer = CourseSerializer(data=data)

            if(serializer.is_valid()):
                print("ISVALID")

                serializer.save()

                return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=409)

        except:

            return Response(status=500)


class LookupCourseBySlug(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'slug'


class LookupCourseById(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'
