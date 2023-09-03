from django.db import models
from utils.models import Country, City, State, GenderType


class Contact(models.Model):
    gender = models.ForeignKey(GenderType, on_delete=models.CASCADE, null=False)
    birthdate = models.DateField(null=False)
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(null=False)
    address = models.TextField(null=False)
    housing_type = models.CharField(max_length=50, null=False)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=False)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=False)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=False)
    comment = models.TextField(null=False)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contacts'