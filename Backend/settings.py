INSTALLED_APPS = [
    # ...existing apps...
    'rest_framework',
    'rest_framework_simplejwt',
    'accounts',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# ...existing settings...
