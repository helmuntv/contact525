"""
URL configuration for contact project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from contact.views import ContactView, ContactListView, ContactEditView

schema_view = get_schema_view(
    openapi.Info(
        title="Contact documentation",
        default_version='v1',
        description="Descripción de tu API",
        terms_of_service="https://www.tu-api.com/terms/",
        contact=openapi.Contact(email="contact@tu-api.com"),
        license=openapi.License(name="Tu Licencia"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    #pages
    path('contact', ContactView.as_view(), name='index'),
    path('contactList', ContactListView.as_view(), name='contact-list'),
    path('contactDetail/<int:contact_id>/', ContactEditView.as_view(), name='contact-detail'),
    
    #admin
    path('admin/', admin.site.urls),

    #apis
    path('api/', include('utils.urls')),
    path('api/', include('contact.urls')),

    #API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
