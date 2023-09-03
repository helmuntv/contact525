from django.urls import path
from . import views

urlpatterns = [
    path('countries/', views.CountryList.as_view(), name='country-list'),
    path('states/', views.StateList.as_view(), name='state-list'),
    path('cities/', views.CityList.as_view(), name='city-list'),
    path('gendertypes/', views.GenderTypeList.as_view(), name='gender-list'),
]
