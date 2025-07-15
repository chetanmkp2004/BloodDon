from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    UserProfile, MedicalAllergy, Medication, MedicalCondition,
    DonationCenter, Donation, EmergencyRequest, EmergencyResponse,
    DonationAppointment
)

class MedicalAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalAllergy
        fields = ['id', 'allergy_name', 'severity', 'created_at']

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'medication_name', 'dosage', 'frequency', 'start_date', 'end_date', 'is_active']

class MedicalConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalCondition
        fields = ['id', 'condition_name', 'diagnosed_date', 'is_chronic', 'notes']

class UserProfileSerializer(serializers.ModelSerializer):
    allergies = MedicalAllergySerializer(source='user.allergies', many=True, read_only=True)
    medications = MedicationSerializer(source='user.medications', many=True, read_only=True)
    medical_conditions = MedicalConditionSerializer(source='user.medical_conditions', many=True, read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'blood_type', 'weight', 'height', 'date_of_birth', 'phone_number',
            'address', 'emergency_contact_name', 'emergency_contact_phone',
            'emergency_contact_relationship', 'last_checkup', 'donation_eligibility',
            'allergies', 'medications', 'medical_conditions'
        ]
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
        }
    
    def validate_weight(self, value):
        if value is not None:
            try:
                # Convert string to decimal if needed
                if isinstance(value, str):
                    value = float(value)
                if value <= 0 or value > 300:
                    raise serializers.ValidationError("Weight must be between 1 and 300 kg.")
            except (ValueError, TypeError):
                raise serializers.ValidationError("Invalid weight value.")
        return value
    
    def validate_height(self, value):
        if value is not None:
            try:
                # Convert string to decimal if needed
                if isinstance(value, str):
                    value = float(value)
                if value <= 0 or value > 300:
                    raise serializers.ValidationError("Height must be between 1 and 300 cm.")
            except (ValueError, TypeError):
                raise serializers.ValidationError("Invalid height value.")
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        # Remove password2 as it's not needed for user creation
        validated_data.pop('password2', None)
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')

class DonationCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCenter
        fields = '__all__'

class DonationSerializer(serializers.ModelSerializer):
    donation_center = DonationCenterSerializer(read_only=True)
    donation_center_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['user']

class DonationAppointmentSerializer(serializers.ModelSerializer):
    donation_center = DonationCenterSerializer(read_only=True)
    donation_center_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = DonationAppointment
        fields = '__all__'
        read_only_fields = ['user']

class EmergencyRequestSerializer(serializers.ModelSerializer):
    responses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = EmergencyRequest
        fields = '__all__'
    
    def get_responses_count(self, obj):
        return obj.responses.count()

class EmergencyResponseSerializer(serializers.ModelSerializer):
    emergency_request = EmergencyRequestSerializer(read_only=True)
    emergency_request_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = EmergencyResponse
        fields = '__all__'
        read_only_fields = ['user']
