from django.http.response import FileResponse
from django.shortcuts import render

from greenhouse_v2.settings import BASE_DIR


def response_file(filename):
    return FileResponse(open(f'{BASE_DIR}/client/build/{filename}', 'rb'))


def page(request):
    return render(request, 'index.html', {})


def detail_page(request, slug):
    return render(request, 'index.html', {})


def favicon(request):
    return response_file('favicon.ico')


def logo_192(request):
    return response_file('logo192.png')


def logo_512(request):
    return response_file('logo512.png')


def manifest(request):
    return response_file('manifest.json')


def robots(request):
    return response_file('robots.txt')
