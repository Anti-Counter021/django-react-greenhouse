CREATE USER greenhouse_react_django_user WITH PASSWORD 'greenhouseReactDjangoPassword';

CREATE DATABASE greenhouse_react_django_db;
GRANT ALL PRIVILEGES ON DATABASE greenhouse_react_django_db TO greenhouse_react_django_user;
