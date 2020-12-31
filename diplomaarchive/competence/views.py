from django.shortcuts import render
from .serializers import CompetenceSerializer, ExemptionSerializer
from .models import Competence, Exemption
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny   

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