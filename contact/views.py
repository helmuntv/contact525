from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer, ContactGetSerializer
from django.shortcuts import get_object_or_404
from rest_framework.renderers import TemplateHTMLRenderer
from drf_yasg.utils import swagger_auto_schema


class ContactView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'contact.html'

    @swagger_auto_schema(auto_schema=None)
    def get(self, request):
        context = {'message': '¡Pagina de contacto!'}
        return Response(context, status=status.HTTP_200_OK)
    

class ContactListView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'contactList.html'

    @swagger_auto_schema(auto_schema=None)
    def get(self, request):
        context = {'message': '¡Lista de contactos!'}
        return Response(context, status=status.HTTP_200_OK)
    
    
class ContactEditView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'contactDetail.html'

    @swagger_auto_schema(auto_schema=None)
    def get(self, request, contact_id):
        context = {'contact_id': contact_id}
        return Response(context, status=status.HTTP_200_OK)


class ContactListCreateView(APIView):
    def get(self, request):
        contacts = Contact.objects.filter(active=True)
        serializer = ContactGetSerializer(contacts, many=True)
        
        city_counts = {}
        
        for contact_data in serializer.data:
            city_name = contact_data['city']['name']
            city_counts[city_name] = city_counts.get(city_name, 0) + 1
        
        response_data = {
            'contacts': serializer.data,
            'city_counts': city_counts,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)


    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactDetailView(APIView):
    def get(self, request, pk):
        contact = get_object_or_404(Contact, pk=pk)
        serializer = ContactGetSerializer(contact)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def put(self, request, pk):
        contact = get_object_or_404(Contact, pk=pk)
        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        contact = get_object_or_404(Contact, pk=pk)
        contact.active = False
        contact.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
