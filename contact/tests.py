from django.test import TestCase
from .models import Contact, GenderType, Country, City, State
from .serializers import ContactSerializer
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


class ContactSerializerTests(TestCase):
    def test_serialization(self):
        contact_data = {
            "gender": 1,
            "birthdate": "2005-09-01",
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "address": "prueba direccion",
            "housing_type": "Casa",
            "country": 1,
            "state": 3,
            "city": 7,
            "comment": "prueba"
        }
        serializer = ContactSerializer(data=contact_data)
        self.assertTrue(serializer.is_valid())


class ContactAPITests(TestCase): 

    def test_get_contacts(self):
        client = APIClient()
        url = reverse("contact-list")
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


    def test_create_contact(self):
        client = APIClient()
        url = reverse("contact-list")
        gender_type = GenderType.objects.create(name='Male')
        data = {
            "gender": gender_type.id,
            "birthdate": "2005-09-01",
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "address": "prueba direccion",
            "housing_type": "Casa",
            "country": 1,
            "state": 3,
            "city": 7,
            "comment": "prueba"
        }
       
        response = client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 1)


    def test_update_contact_success(self):
        #Prueba de actualización exitosa
        client = APIClient()
        gender_type = GenderType.objects.create(name='Male')
        country = Country.objects.create(name='Argentina')
        state = State.objects.create(name='La Pampa', country_id=country.id)
        city = City.objects.create(name='Macachin', state_id=state.id)
        contact = Contact.objects.create(
            gender=gender_type,
            birthdate="2005-09-01",
            first_name="Alice",
            last_name="Johnson",
            email="alice@example.com",
            address="prueba direccion",
            housing_type="Casa",
            country=country,
            state=state,
            city=city,
            comment="prueba"
        )

        url = reverse("contact-detail", args=[contact.id])
        updated_data = {
            "gender": gender_type.id,
            "birthdate": "2005-09-01",
            "first_name": "Update",
            "last_name": "Update",
            "email": "update@example.com",
            "address": "prueba direccion update",
            "housing_type": "Casa",
            "country": country.id,
            "state": state.id,
            "city": city.id,
            "comment": "prueba"
        }
        response = client.put(url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Contact.objects.get(id=contact.id).first_name, "Update")


    def test_update_contact_error(self):
        #Prueba de actualización exitosa
        client = APIClient()
        gender_type = GenderType.objects.create(name='Male')
        country = Country.objects.create(name='Argentina')
        state = State.objects.create(name='La Pampa', country_id=country.id)
        city = City.objects.create(name='Macachin', state_id=state.id)
        contact = Contact.objects.create(
            gender=gender_type,
            birthdate="2005-09-01",
            first_name="Alice",
            last_name="Johnson",
            email="alice@example.com",
            address="prueba direccion",
            housing_type="Casa",
            country=country,
            state=state,
            city=city,
            comment="prueba"
        )

        url = reverse("contact-detail", args=[contact.id])
        # Prueba de actualización con datos incorrectos
        invalid_data = {
            "gender": gender_type.id,
            "birthdate": "2005-09-01",
            "first_name": "Update",
            "last_name": "Update",
            "email": "update", #parametro incorrecto
            "address": "prueba direccion update",
            "housing_type": "Casa",
            "country": country.id,
            "state": state.id,
            "city": city.id,
            "comment": "prueba"
        }
        response = client.put(url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_delete_contact_success(self):
        # Prueba de eliminación exitosa
        client = APIClient()
        gender_type = GenderType.objects.create(name='Male')
        country = Country.objects.create(name='Argentina')
        state = State.objects.create(name='La Pampa', country_id=country.id)
        city = City.objects.create(name='Macachin', state_id=state.id)
        contact = Contact.objects.create(
            gender=gender_type,
            birthdate="2005-09-01",
            first_name="Alice",
            last_name="Johnson",
            email="alice@example.com",
            address="prueba direccion",
            housing_type="Casa",
            country=country,
            state=state,
            city=city,
            comment="prueba"
        )

        url = reverse("contact-detail", args=[contact.id])
        response = client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(Contact.objects.filter(id=contact.id, active=False).exists())


    def test_delete_contact_not_found(self):
        # Prueba de eliminación de un contacto que no existe
        client = APIClient()
        non_existent_url = reverse("contact-detail", args=[9999])
        response = client.delete(non_existent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)