from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        print(request.user.groups.all())
        if request.user and request.user.groups.filter(name='student'):
            return True
        return False


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.groups.filter(name='employee'):
            return True
        return False