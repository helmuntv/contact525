from django.contrib import admin
from .models import GenderType, Country, City, State

admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(GenderType)
