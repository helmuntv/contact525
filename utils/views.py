from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Country, State, City, GenderType
from .serializers import CountrySerializer, StateSerializer, CitySerializer, GenderTypeSerializer
from rest_framework.renderers import TemplateHTMLRenderer


class CountryList(APIView):
    def get(self, request):        
        countries = Country.objects.filter(active=True)
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data,  status=status.HTTP_200_OK)


class CountryDetail(APIView):
    def get(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        serializer = CountrySerializer(country)
        return Response(serializer.data,  status=status.HTTP_200_OK)
    

class StateList(APIView):
    def get(self, request):
        country_id = request.query_params.get('country_id')

        if country_id:
            states = State.objects.filter(active=True, country_id=country_id)
        else:
            states = State.objects.filter(active=True)

        serializer = StateSerializer(states, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StateDetail(APIView):
    def get(self, request, pk):
        state = get_object_or_404(State, pk=pk)
        serializer = StateSerializer(state)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CityList(APIView):
    def get(self, request):
        state_id = request.query_params.get('state_id')

        if state_id:
            cities = City.objects.filter(active=True, state_id=state_id)
        else:
            cities = City.objects.filter(active=True)

        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CityDetail(APIView):
    def get(self, request, pk):
        city = get_object_or_404(City, pk=pk)
        serializer = CitySerializer(city)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GenderTypeList(APIView):
    def get(self, request):
        gender_types = GenderType.objects.filter(active=True)
        serializer = GenderTypeSerializer(gender_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GenderTypeDetail(APIView):
    def get(self, request, pk):
        gender = get_object_or_404(City, pk=pk)
        serializer = GenderTypeSerializer(gender)
        return Response(serializer.data, status=status.HTTP_200_OK)