import os
import django
from django.db import connection

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Blood_Donation_Backend.settings')
django.setup()

def check_database():
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print("Database tables:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Check if our models' tables exist
        model_tables = [
            'accounts_userprofile',
            'accounts_medicalallergy', 
            'accounts_medication',
            'accounts_medicalcondition',
            'accounts_donationcenter',
            'accounts_donation',
            'accounts_emergencyrequest',
            'accounts_emergencyresponse',
            'accounts_donationappointment'
        ]
        
        existing_tables = [table[0] for table in tables]
        print("\nModel table status:")
        for table in model_tables:
            status = "✓ EXISTS" if table in existing_tables else "✗ MISSING"
            print(f"  {table}: {status}")
            
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_database()
