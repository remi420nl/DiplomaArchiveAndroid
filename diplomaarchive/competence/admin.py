from django.contrib import admin
from .models import Competence, Exemption

class CompetenceAdmin(admin.ModelAdmin):

    list_display = ('id','name')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    list_per_page = 5

admin.site.register(Competence,CompetenceAdmin)

class ExemptionAdmin(admin.ModelAdmin):

    list_display = ('id','student','course')
    list_display_links = ('id', 'student')
    search_fields = ('id',)
    list_per_page = 10

admin.site.register(Exemption,ExemptionAdmin)
