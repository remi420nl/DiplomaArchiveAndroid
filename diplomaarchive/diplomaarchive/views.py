from django.shortcuts import render, redirect
from django.http import HttpResponse


def index(request):
    return HttpResponse("testttt")

def dashboard(request):
    print("dashbooard view")
    if not request.user.is_authenticated:
        
        return HttpResponse("Not authorized")


    return HttpResponse("<h1>Dashboard</h1>")