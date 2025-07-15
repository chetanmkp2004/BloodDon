from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create a test user'

    def handle(self, *args, **options):
        # Create test user if it doesn't exist
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='testpass123'
            )
            self.stdout.write(
                self.style.SUCCESS('Test user created successfully: testuser/testpass123')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Test user already exists')
            )
