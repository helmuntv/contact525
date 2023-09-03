from rest_framework import serializers
from .models import Country, State, City, GenderType


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = [
            'id',
            'name',
            'description'
        ]


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = [
            'id',
            'name',
            'description',
            'country'
        ]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'description',
            'state'
        ]


class GenderTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenderType
        fields = [
            'id',
            'name'
        ]