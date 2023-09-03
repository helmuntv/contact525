from django.db import models


class Country(models.Model):
    name         = models.CharField(max_length=100, null=False, unique=True)
    description  = models.TextField(blank=True, null=True)
    active       = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'countries'

    def __str__(self):
        return self.name


class State(models.Model):
    name         = models.CharField(max_length=100, null=False, unique=True)
    description  = models.TextField(blank=True, null=True)
    country      = models.ForeignKey(Country, on_delete=models.CASCADE)
    active       = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'states'

    def __str__(self):
        return self.name


class City(models.Model):
    name         = models.CharField(max_length=100, null=False, unique=True)
    description  = models.TextField(blank=True, null=True)
    state        = models.ForeignKey(State, on_delete=models.CASCADE)
    active       = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cities'

    def __str__(self):
        return self.name
    

class GenderType(models.Model):
    name         = models.CharField(max_length=100, null=False, unique=True)
    active       = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gender_types'

    def __str__(self):
        return self.name