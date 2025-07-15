from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from .serializers import (
    UserSerializer, RegisterSerializer, UserProfileSerializer,
    MedicalAllergySerializer, MedicationSerializer, MedicalConditionSerializer,
    DonationCenterSerializer, DonationSerializer, DonationAppointmentSerializer,
    EmergencyRequestSerializer, EmergencyResponseSerializer
)
from .models import (
    UserProfile, MedicalAllergy, Medication, MedicalCondition,
    DonationCenter, Donation, DonationAppointment,
    EmergencyRequest, EmergencyResponse
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        print(f"Registration data received: {request.data}")  # Debug logging
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': {
                    'username': user.username,
                    'email': user.email
                },
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
        else:
            print(f"Serializer errors: {serializer.errors}")  # Debug logging
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def update(self, request, *args, **kwargs):
        print(f"Profile update data received: {request.data}")  # Debug logging
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            print(f"Profile updated successfully: {serializer.data}")  # Debug logging
            return Response(serializer.data)
        else:
            print(f"Profile serializer errors: {serializer.errors}")  # Debug logging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Donation Centers
class DonationCenterListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DonationCenterSerializer
    
    def get_queryset(self):
        return DonationCenter.objects.filter(is_active=True)

# Donations History
class DonationHistoryView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DonationSerializer
    
    def get_queryset(self):
        return Donation.objects.filter(user=self.request.user)

# Appointments
class AppointmentListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DonationAppointmentSerializer
    
    def get_queryset(self):
        return DonationAppointment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DonationAppointmentSerializer
    
    def get_queryset(self):
        return DonationAppointment.objects.filter(user=self.request.user)

# Emergency Requests
class EmergencyRequestListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = EmergencyRequestSerializer
    
    def get_queryset(self):
        return EmergencyRequest.objects.filter(
            status='active',
            expires_at__gt=timezone.now()
        ).order_by('-urgency', '-created_at')

class EmergencyResponseCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = EmergencyResponseSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Medical Information Views
class MedicalAllergyListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedicalAllergySerializer
    
    def get_queryset(self):
        return MedicalAllergy.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicalAllergyDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedicalAllergySerializer
    
    def get_queryset(self):
        return MedicalAllergy.objects.filter(user=self.request.user)

class MedicationListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedicationSerializer
    
    def get_queryset(self):
        return Medication.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedicationSerializer
    
    def get_queryset(self):
        return Medication.objects.filter(user=self.request.user)

class MedicalConditionListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedicalConditionSerializer
    
    def get_queryset(self):
        return MedicalCondition.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicalConditionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MedicalConditionSerializer
    
    def get_queryset(self):
        return MedicalCondition.objects.filter(user=self.request.user)

# JWT login view is provided by SimpleJWT
