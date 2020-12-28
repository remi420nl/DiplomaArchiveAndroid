from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import permissions

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny    

from .models import Class,Competence,Diploma,Exemption

from rest_framework.decorators import api_view, authentication_classes,permission_classes

from .serializers import ClassSerializer, CompetenceSerializer, DiplomaSerializer, ExemptionSerializer
from datetime import datetime, timezone, timedelta


from rest_framework import permissions

class SkipAuth(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return True


class ClassesView(ListAPIView):

    serializer_class = ClassSerializer

    permission_classes = (AllowAny,)

    def get_queryset(self):
        classes = Class.objects.all()

        serializer = ClassSerializer(classes, many=True)

        return classes

#@apiview(['Post',])
class AddClass(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ClassSerializer
    queryset = Class.objects.all()

    def post(self, request,format=None, *args, **kwargs):
         data = request.data
         print(data)

         name = data['name']
         slug = data['slug']
         competences = data['competences']

         saved_class = Class.objects.create(name=name, slug=slug)

         for competence in competences:
             if not Competence.objects.filter(name = competence).exists():
                 c = Competence.objects.create(name = competence)
                 saved_class.competences.add(c)
             else:
                 c =  Competence.objects.get(name = competence)
                 saved_class.competences.add(c)
      

         serializer = ClassSerializer(saved_class)

         return Response(serializer.data)

            
class LookupClass(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    lookup_field = 'slug'
  
        