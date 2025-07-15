from django.core.management.base import BaseCommand
from accounts.models import DonationCenter, EmergencyRequest
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Create sample data for blood donation app'

    def handle(self, *args, **options):
        # Create sample donation centers
        centers = [
            {
                'name': 'City General Hospital Blood Bank',
                'address': '123 Main St, Downtown, City 12345',
                'phone_number': '+1-555-0101',
                'email': 'bloodbank@citygeneral.com',
                'operating_hours': 'Mon-Fri: 8AM-6PM, Sat: 9AM-3PM'
            },
            {
                'name': 'Red Cross Donation Center',
                'address': '456 Oak Ave, Midtown, City 12346',
                'phone_number': '+1-555-0102',
                'email': 'donate@redcross.org',
                'operating_hours': 'Mon-Sun: 7AM-8PM'
            },
            {
                'name': 'Community Health Blood Drive',
                'address': '789 Pine Rd, Uptown, City 12347',
                'phone_number': '+1-555-0103',
                'email': 'info@communityhealth.org',
                'operating_hours': 'Tue-Thu: 10AM-7PM, Sat-Sun: 8AM-4PM'
            }
        ]

        for center_data in centers:
            center, created = DonationCenter.objects.get_or_create(
                name=center_data['name'],
                defaults=center_data
            )
            if created:
                self.stdout.write(f"Created donation center: {center.name}")

        # Create sample emergency requests
        emergency_requests = [
            {
                'hospital_name': 'Emergency Medical Center',
                'blood_type_needed': 'O-',
                'units_needed': 5,
                'urgency': 'critical',
                'patient_condition': 'Trauma patient - multiple injuries',
                'contact_person': 'Dr. Sarah Johnson',
                'contact_phone': '+1-555-9999',
                'location': 'Emergency Medical Center, 999 Emergency Blvd',
                'expires_at': timezone.now() + timedelta(hours=6)
            },
            {
                'hospital_name': 'Children\'s Hospital',
                'blood_type_needed': 'A+',
                'units_needed': 3,
                'urgency': 'high',
                'patient_age': 8,
                'patient_condition': 'Surgical procedure - pediatric patient',
                'contact_person': 'Dr. Michael Chen',
                'contact_phone': '+1-555-8888',
                'location': 'Children\'s Hospital, 888 Kids Way',
                'expires_at': timezone.now() + timedelta(hours=12)
            },
            {
                'hospital_name': 'St. Mary\'s Medical Center',
                'blood_type_needed': 'B+',
                'units_needed': 2,
                'urgency': 'medium',
                'patient_condition': 'Scheduled surgery preparation',
                'contact_person': 'Nurse Patricia Williams',
                'contact_phone': '+1-555-7777',
                'location': 'St. Mary\'s Medical Center, 777 Health Ave',
                'expires_at': timezone.now() + timedelta(days=1)
            }
        ]

        for req_data in emergency_requests:
            request, created = EmergencyRequest.objects.get_or_create(
                hospital_name=req_data['hospital_name'],
                blood_type_needed=req_data['blood_type_needed'],
                defaults=req_data
            )
            if created:
                self.stdout.write(f"Created emergency request: {request.hospital_name} - {request.blood_type_needed}")

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
