from django.urls import path
from . import views

urlpatterns = [
    path('countries/', views.CountryList.as_view(), name='country-list'),
    path('countries/<int:pk>/', views.CountryDetail.as_view(), name='country-detail'),
    
    path('states/', views.StateList.as_view(), name='state-list'),
    path('states/<int:pk>/', views.StateDetail.as_view(), name='state-detail'),
    
    path('cities/', views.CityList.as_view(), name='city-list'),
    path('cities/<int:pk>/', views.CityDetail.as_view(), name='city-detail'),

    path('gendertypes/', views.GenderTypeList.as_view(), name='gender-list'),
    path('gendertypes/<int:pk>/', views.GenderTypeDetail.as_view(), name='gender-detail'),
]
