from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import CompetenceSerializer, ExemptionSerializer, ExemptionUpdateSerializer
from .models import Competence, Exemption
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from diploma.models import Diploma
from course.models import Course
from course.serializers import CourseSerializer
from diploma.serializers import DiplomaSerializer
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import AllowAny
from diploma.serializers import DiplomaSerializer
from users.permissions import IsEmployee, IsStudent


class ExemptionsView(ListAPIView):

    serializer_class = ExemptionSerializer
    pagination_class = None

    def get_queryset(self):

        if 'course' in self.request.GET and self.request.user.groups.filter(name='employee'):

            try:
                id = self.request.query_params["course"]
                exemptions = Exemption.objects.filter(course_id=id)

                return exemptions
            except:
                exemptions = Exemption.objects.all()

                return exemptions

        if self.request.user.groups.filter(name='student'):

            try:
                id = self.request.user.id
                exemptions = Exemption.objects.filter(student_id=id)

                return exemptions
            except:

                return Response({"error": "Something went wrong.."}, status=404)


class ExemptionView(UpdateAPIView):

    serializer_class = ExemptionSerializer
    permission_classes = (permissions.AllowAny,)

    def get_permissions(self):

        if self.request.method in {'GET', 'POST'}:

            self.permission_classes = [permissions.IsAuthenticated, ]

            return super(ExemptionView, self).get_permissions()

        if self.request.method in {'PUT', 'DELETE'}:

            self.permission_classes = [IsEmployee, ]

            return super(ExemptionView, self).get_permissions()

    def get(self, request, *args, **kwargs):

        if 'course' in request.GET:

            id = request.query_params['course']

    def post(self, request, *args, **kwargs):

        if 'course' in request.GET:

            try:
                courseId = request.query_params['course']
                user = request.user

                course = Course.objects.get(id=courseId)

                exemption = Exemption.objects.create(
                    course=course, student=user)

                serializer = ExemptionSerializer(exemption)
                return Response(serializer.data, status=201)
            except:
                return Response({"error": "something went wrong"}, status=500)

    def put(self, request, *args, **kwargs):

        if 'id' in request.GET:

            id = request.query_params['id']
            exemption = Exemption.objects.get(id=id)
            serializer = ExemptionUpdateSerializer(
                exemption, data=request.data, partial=True)
            if(serializer.is_valid()):
                serializer.save()
                return Response({'message': 'updated'}, status=200)


class CompetencesView(ListAPIView):

    serializer_class = CompetenceSerializer
    queryset = Competence.objects.all()
    pagination_class = None


class CompetenceView(APIView):

    serializer_class = CompetenceSerializer

    def check_matches(self, student, course, combined):
        for s_competence in student:
            for c_competence in course:
                if s_competence == c_competence:
                    s_competence.match = True
                    c_competence.match = True

        serializer = CompetenceSerializer(student, many=True)

        combined['student'] = serializer.data

        serializer = CompetenceSerializer(
            course, many=True)

        combined['course'] = serializer.data

        return combined

    def get(self, request, format=None):

        combined = {}

        student_competences = []
        course_competences = []

        if 'id' in self.request.GET:

            id = self.request.query_params['id']

        if 'course' in self.request.GET:

            id = self.request.query_params['course']
            if id is not None:
                course_id = id

                try:
                    course_competences = Competence.objects.filter(
                        course__id=id)

                    for competence in course_competences:
                        competence.match = False

                    # to trigger an error in case nothing is found
                    course_competences[0]

                except:
                    combined['courses'] = {
                        'error': 'course with id {0} has no competences'.format(id)}

        if 'student' in self.request.GET:
            id = self.request.query_params['student']

            if id is not None:

                try:

                    diplomas = Diploma.objects.filter(student_id=id)

                    # to trigger an error in case nothing is found
                    diplomas[0]

                    for diploma in diplomas:

                        diploma_competences = Competence.objects.filter(
                            diploma__id=diploma.id)
                        for competence in diploma_competences:
                            competence.match = False

                            student_competences.append(competence)

                except:
                    combined['student'] = {
                        'error': 'student with id {0} has no diplomas'.format(id)}

        if 'diploma' in self.request.GET:

            id = self.request.query_params['diploma']
            if id is not None:
                try:
                    competences = Competence.objects.filter(diploma__id=id)

                    # to trigger an error in case nothing is found
                    competences[0]

                    serializer = CompetenceSerializer(competences, many=True)
                    combined['diploma'] = serializer.data

                except:
                    combined['diploma'] = {
                        'error': 'diploma with id {0} has no competences'.format(id)}

        combined = self.check_matches(
            student_competences, course_competences, combined)

        return Response(combined, status=200)


class CompetenceUpdateView(UpdateAPIView):

    serializer_class = CompetenceSerializer
    permission_classes = (permissions.AllowAny,)

    def update(self, request, *args, **kwargs):

        def add_competences(instance, data):

            for id in data:
                try:
                    c = Competence.objects.get(id=id)
                    instance.competences.add(c)
                except ObjectDoesNotExist:
                    return Response({"error": "Competence with id {0} could not be added".format(id)}, status=500)

            return instance

        if 'diploma' in request.GET:
            id = request.query_params['diploma']
            try:

                diploma = Diploma.objects.get(id=id)
            except:
                return Response({"error": "no diploma found with id {0}".format(id)}, status=404)

            data = request.data
            competences = data['competences']

            updated_diploma = add_competences(diploma, competences)

            serializer = DiplomaSerializer(updated_diploma)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if 'course' in request.GET:
            id = request.query_params['course']
            try:

                course = Course.objects.get(id=id)
            except:
                return Response({"error": "no course found with id {0}".format(id)}, status=404)

            data = request.data
            competences = data['competences']

            updated_course = add_competences(course, competences)

            serializer = CourseSerializer(updated_course)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):

        course_id = request.query_params['course']
        competence_id = request.query_params['competence']

        try:

            competence = Competence.objects.get(id=competence_id)
            course = Course.objects.get(id=course_id)

            r = course.competences.remove(competence)

            serializer = CourseSerializer(course)

            return Response(serializer.data, status=200)

        except:

            return Response({"error": "someteing went wrong"}, status=500)
