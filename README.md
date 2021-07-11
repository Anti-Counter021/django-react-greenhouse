# Django + React + Redux. Greenhouse v2

### Installing:

    cd front
    npm install
    npm run build

    cd ../back

    create Database from Postgres
    create file config.env how config.ini
    create directories logs, media, static

    python -m venv DirectoryVENV
    source DirectoryVENV/bin/activate
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver
