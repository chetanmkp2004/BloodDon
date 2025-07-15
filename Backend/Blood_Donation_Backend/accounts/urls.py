from django.urls import path
from .views import (
    RegisterView, UserView, UserProfileView,
    DonationCenterListView, DonationHistoryView,
    AppointmentListCreateView, AppointmentDetailView,
    EmergencyRequestListView, EmergencyResponseCreateView,
    MedicalAllergyListCreateView, MedicalAllergyDetailView,
    MedicationListCreateView, MedicationDetailView,
    MedicalConditionListCreateView, MedicalConditionDetailView
)
from .test_views import test_register
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('test-register/', test_register, name='test_register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/<int:pk>/', UserView.as_view(), name='profile_detail'),
    
    # Donation Centers
    path('donation-centers/', DonationCenterListView.as_view(), name='donation_centers'),
    
    # Donations
    path('donations/', DonationHistoryView.as_view(), name='donation_history'),
    
    # Appointments
    path('appointments/', AppointmentListCreateView.as_view(), name='appointments'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
    
    # Emergency Requests
    path('emergency-requests/', EmergencyRequestListView.as_view(), name='emergency_requests'),
    path('emergency-responses/', EmergencyResponseCreateView.as_view(), name='emergency_responses'),
    
    # Medical Information
    path('allergies/', MedicalAllergyListCreateView.as_view(), name='allergies'),
    path('allergies/<int:pk>/', MedicalAllergyDetailView.as_view(), name='allergy_detail'),
    path('medications/', MedicationListCreateView.as_view(), name='medications'),
    path('medications/<int:pk>/', MedicationDetailView.as_view(), name='medication_detail'),
    path('medical-conditions/', MedicalConditionListCreateView.as_view(), name='medical_conditions'),
    path('medical-conditions/<int:pk>/', MedicalConditionDetailView.as_view(), name='medical_condition_detail'),
]
