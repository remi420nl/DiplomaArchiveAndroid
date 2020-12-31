from django.contrib import admin
from .models import Diploma

class DiplomaAdmin(admin.ModelAdmin):

    list_display = ('id','name','student','get_competences','front_img', 'back_img' )
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    list_per_page = 10

    def get_competences(self, obj):    
        return "\n".join([c.name for c in obj.competences.all()])

admin.site.register(Diploma,DiplomaAdmin)
