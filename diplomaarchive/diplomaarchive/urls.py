from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users import views as usersview
from . import views

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', usersview.CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path('', views.index),
    path('dashboard', views.dashboard),
    path('api/users/', include('users.urls')),
    path('api/diploma/', include('diploma.urls')),
    path('api/competence/', include('competence.urls')),
    path('api/course/', include('course.urls')),
    path('api/contact/', include('contact.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
