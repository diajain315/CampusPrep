"""
Django settings for Campus Placement Intelligence Platform.
IT643 - Software Design and Testing (DAU)
"""

from pathlib import Path
import os
import sys
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables (Neon .env.local takes precedence)
load_dotenv(BASE_DIR.parent / '.env.local')
load_dotenv(BASE_DIR.parent / '.env')
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-r*lh&9*0blm861@--k7&5z1xzl7r3)dj(^z!p52eq$r4i*rha-'
)

DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party packages
    'rest_framework',

    # Domain Apps
    'apps.common',
    'apps.users',
    'apps.universities',
    'apps.companies',
    'apps.drives',
    'apps.experiences',
    'apps.reviews',
    'apps.resources',
    'apps.workspace',
    'apps.moderation',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database Configuration - Neon PostgreSQL
DATABASE_URL = os.environ.get('DATABASE_URL')
DATABASE_URL_UNPOOLED = os.environ.get('DATABASE_URL_UNPOOLED')

IS_TESTING = 'pytest' in sys.modules or 'test' in sys.argv
IS_MIGRATING = 'migrate' in sys.argv or 'makemigrations' in sys.argv

# Neon Best Practice: Use unpooled endpoint for DDL migrations, pooled for runtime queries
TARGET_DB_URL = DATABASE_URL_UNPOOLED if (IS_MIGRATING and DATABASE_URL_UNPOOLED) else DATABASE_URL

if IS_TESTING and os.environ.get('USE_POSTGRES_FOR_TESTS') != '1':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
elif TARGET_DB_URL:
    DATABASES = {
        'default': dj_database_url.parse(
            TARGET_DB_URL,
            conn_max_age=0 if IS_MIGRATING else 600,
            ssl_require=True
        )
    }
else:
    DB_ENGINE = os.environ.get('DB_ENGINE', 'django.db.backends.postgresql')
    DB_NAME = os.environ.get('POSTGRES_DB', os.environ.get('DB_NAME', 'campusprep_db'))
    DB_USER = os.environ.get('POSTGRES_USER', os.environ.get('DB_USER', 'postgres'))
    DB_PASSWORD = os.environ.get('POSTGRES_PASSWORD', os.environ.get('DB_PASSWORD', ''))
    DB_HOST = os.environ.get('POSTGRES_HOST', os.environ.get('DB_HOST', 'localhost'))
    DB_PORT = os.environ.get('POSTGRES_PORT', os.environ.get('DB_PORT', '5432'))

    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
        }
    }

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
