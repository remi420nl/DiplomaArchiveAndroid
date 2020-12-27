from django.http import HttpResponse
from django.shortcuts import redirect

def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home')
        else:

          return view_func(request, *args, **kwargs)

    return wrapper_func

def allowed_users(allowed_roles=[]):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):

            for role in allowed_roles:
                print(str(request.user.groups.all()))
                if request.user.groups.filter(name = role).exists():
                   print("permission granted")

                   return view_func(request, *args, **kwargs) 
            return HttpResponse("Not authorized")
        return wrapper_func
    return decorator

