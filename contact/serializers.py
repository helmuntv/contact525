from rest_framework import serializers
from .models import Contact
from dateutil.relativedelta import relativedelta
from datetime import date
from utils.serializers import CitySerializer, CountrySerializer, StateSerializer, GenderTypeSerializer
import os


class ContactGetSerializer(serializers.ModelSerializer):
    city = CitySerializer()
    country = CountrySerializer()
    state = StateSerializer()
    gender = GenderTypeSerializer()

    class Meta:
        model = Contact
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

    def validate(self, data):
        birthdate = data.get('birthdate')
        country = data.get('country')
        state = data.get('state')
        city = data.get('city')

        if birthdate:
            today = date.today()
            age = relativedelta(today, birthdate).years
            if age < int(os.getenv('MINIMUM_AGE')):
                raise serializers.ValidationError({"birthdate": "You must be over 18 years of age to register."})
            
        if state and state.country != country:
            raise serializers.ValidationError({"state": "The state does not correspond to the specified country."})

        if city and (not state or city.state != state):
            raise serializers.ValidationError({"city": "The city does not correspond to the specified state."})
        

        existing_contacts = Contact.objects.filter(city=city, active=True)
        if self.instance:
            existing_contacts = existing_contacts.exclude(pk=self.instance.pk)
        if existing_contacts.count() >= int(os.getenv("MAX_CONTACTS_PER_CITY")):
            raise serializers.ValidationError({"city": f"There are already {os.getenv('MAX_CONTACTS_PER_CITY')} records for this city. No more are allowed."})
        
        return data