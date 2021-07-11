FROM python:3.8

WORKDIR /home/counter/programming_projects/greenhouses/site

COPY requirements.txt .
COPY entrypoint.sh .

RUN pip install -r requirements.txt
RUN pip install gunicorn
RUN chmod +x entrypoint.sh

COPY . .

ENTRYPOINT ["sh", "/home/counter/programming_projects/greenhouses/site/entrypoint.sh"]
