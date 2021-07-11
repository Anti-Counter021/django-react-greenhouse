#!/bin/bash

python3 manage.py makemigrations
python3 manage.py migrate
#python3 manage.py collectstatic

exec gunicorn greenhouse_v2.wsgi:application -b 0.0.0.0:8000 --reload
