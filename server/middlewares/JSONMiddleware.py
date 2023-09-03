import json
from django.http import JsonResponse

class ValidateJSONAcceptHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/swagger') or request.path.startswith('/redoc') or request.path.startswith('/admin') or request.path.startswith('/contact') or request.path.startswith('/contactList') or request.path.startswith('/contactDetail'):
            response = self.get_response(request)
        else:
            if 'HTTP_ACCEPT' not in request.META:
                return JsonResponse(
                    {"error": "The Accept header must be set to 'application/json'."},
                    status=400
                )
            
            if request.META['HTTP_ACCEPT'] != 'application/json':
                return JsonResponse(
                    {"error": "The Accept header must be set to 'application/json'."},
                    status=400
                )

            response = self.get_response(request)
        return response
