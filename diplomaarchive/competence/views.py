from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import CompetenceSerializer, ExemptionSerializer, ExemptionUpdateSerializer
from .models import Competence, Exemption
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
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
                return Response({'message': 'updated'}, status=20)


class CompetencesView(ListAPIView):

    serializer_class = CompetenceSerializer
    queryset = Competence.objects.all()
    permission_classes = (AllowAny,)


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

        if 'course' in request.GET:

            id = request.query_params['course']

            competences = Competence.objects.filter(course__id=id)
            print(competences)

            serializer = CompetenceSerializer(competences, many=True)

            return Response(
                {"competences": serializer.data}, status=200)
