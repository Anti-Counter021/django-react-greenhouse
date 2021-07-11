FROM python:3.8-alpine

WORKDIR /app

RUN apk --update add
RUN apk add gcc libc-dev libffi-dev jpeg-dev zlib-dev libjpeg
RUN apk add postgresql-dev

RUN pip install --upgrade pip

COPY requirements.txt .
COPY entrypoint.sh .

RUN pip install -r requirements.txt
RUN pip install gunicorn

RUN chmod +x entrypoint.sh

COPY . .

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
