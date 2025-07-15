#!/bin/bash

# Test script to verify profile update functionality
echo "Testing Profile Update API..."

# Test profile update with curl
curl -X PUT "http://localhost:8000/api/profile/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "blood_type": "A+",
    "weight": "70.5",
    "height": "175.0",
    "date_of_birth": "1990-01-01",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, State",
    "emergency_contact_name": "John Doe",
    "emergency_contact_phone": "+0987654321",
    "emergency_contact_relationship": "Spouse",
    "last_checkup": "2024-01-01",
    "donation_eligibility": true
  }'

echo ""
echo "Profile update test completed."
