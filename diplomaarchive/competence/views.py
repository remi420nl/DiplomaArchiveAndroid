from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import CompetenceSerializer, ExemptionSerializer, ExemptionUpdateSerializer
from .models import Competence, Exemption
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from diploma.models import Diploma
from diploma.serializers import DiplomaSerializer
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import AllowAny
from diploma.serializers import DiplomaSerializer
from users.permissions import IsEmployee, IsStudent


class ExemptionsView(ListAPIView):

    serializer_class = ExemptionSerializer
    pagination_class = None

    def get_permissions(self):

        if self.request.method == 'GET':

            self.permission_classes = [IsEmployee, ]

            return super(ExemptionsView, self).get_permissions()

    def get_queryset(self):

        if 'course' in self.request.GET:
            try:
                id = self.request.query_params["course"]
                exemptions = Exemption.objects.filter(course_id=id)

                return exemptions
            except:
                return Response({"error": "Something went wrong.."}, status=404)

        exemptions = Exemption.objects.all()

        return exemptions


class ExemptionView(UpdateAPIView):

    serializer_class = ExemptionSerializer

    def get_permissions(self):

        if self.request.method in {'GET', 'POST'}:

            self.permission_classes = [permissions.IsAuthenticated, ]

            return super(ExemptionView, self).get_permissions()

        if self.request.method in {'PUT', 'DELETE'}:
            print(self.request.user)

            self.permission_classes = [IsEmployee, ]

            return super(ExemptionView, self).get_permissions()

    def get(self, request, *args, **kwargs):

        if 'id' in request.GET:

            id = request.query_params['id']

    def post(self, request, *args, **kwargs):

        if 'id' in request.GET:

            id = request.query_params['id']

    def put(self, request, *args, **kwargs):

        if 'id' in request.GET:

            id = request.query_params['id']
            exemption = Exemption.objects.get(id=id)
            serializer = ExemptionUpdateSerializer(
                exemption, data=request.data, partial=True)
            if(serializer.is_valid()):
                serializer.save()
                return Response({'message': 'updated'}, status=200)


class CompetencesView(APIView):

    serializer_class = CompetenceSerializer

    # needs to be removed
    permission_classes = (AllowAny,)

    def get(self, request, format=None):

        combined = []

        if 'id' in self.request.GET:

            id = self.request.query_params['id']

        if 'course' in self.request.GET:

            id = self.request.query_params['course']
            if id is not None:
                try:
                    competences = Competence.objects.filter(course__id=id)

                    # to trigger an error in case nothing is found
                    competences[0]

                    serializer = CompetenceSerializer(competences, many=True)
                    result = {'course_competences': serializer.data}

                    combined.append(result)
                except:
                    combined.append(
                        {'error': 'course with id {0} has no competences'.format(id)})

        if 'student' in self.request.GET:
            id = self.request.query_params['student']

            if id is not None:

                try:

                    diplomas = Diploma.objects.filter(student_id=id)

                    # to trigger an error in case nothing is found
                    diplomas[0]

                    competences = []

                    for diploma in diplomas:

                        competences_from_diploma = Competence.objects.filter(
                            diploma__id=diploma.id)
                        for competence in competences_from_diploma:
                            competences.append(competence)

                    serializer = CompetenceSerializer(competences, many=True)

                    result = {'student_competences': serializer.data}

                    combined.append(result)
                except:
                    combined.append(
                        {'error': 'student with id {0} has no diplomas'.format(id)})

        if 'diploma' in self.request.GET:
            id = self.request.query_params['diploma']
            if id is not None:
                try:
                    competences = Competence.objects.filter(diploma__id=id)
                    # to trigger an error in case nothing is found
                    competences[0]

                    serializer = CompetenceSerializer(competences, many=True)
                    result = {'diploma_competences': serializer.data}

                    combined.append(result)

                except:
                    combined.append(
                        {'error': 'diploma with id {0} has no competences'.format(id)})

        return Response(combined, status=200)


class CompetenceView(UpdateAPIView):

    serializer_class = CompetenceSerializer
    permission_classes = (permissions.AllowAny,)

    def update(self, request, *args, **kwargs):

        if 'diploma' in request.GET:

            try:
                id = request.query_params["diploma"]
                diploma = Diploma.objects.get(id=id)
            except:
                return Response({"error": "geen diploma gevonden met id {0}".format(id)}, status=404)

            data = request.data
            competences = data['competences']
            for competence in competences:
                try:
                    c = Competence.objects.get(name=competence['name'])
                    diploma.competences.add(c)
                except ObjectDoesNotExist:
                    c = Competence.objects.create(name=competence['name'])
                    diploma.competences.add(c)

        serializer = DiplomaSerializer(diploma)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):

        if 'id' in request.GET:

            id = request.query_params['id']
