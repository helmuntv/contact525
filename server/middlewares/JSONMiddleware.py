import json
from django.http import JsonResponse

class ValidateJSONAcceptHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("request.path------->", request.path)
        # Verificar si la solicitud está destinada a las rutas de Swagger
        if request.path.startswith('/swagger') or request.path.startswith('/redoc') or request.path.startswith('/admin'):
            response = self.get_response(request)
        else:
            # Verifica si el encabezado Accept está presente en la solicitud
            if 'HTTP_ACCEPT' not in request.META:
                # Si no está presente, retorna una respuesta JSON de error
                return JsonResponse(
                    {"error": "The Accept header must be set to 'application/json'."},
                    status=400
                )
            
            # Verifica que el encabezado Accept sea 'application/json'
            if request.META['HTTP_ACCEPT'] != 'application/json':
                # Si no es 'application/json', retorna una respuesta JSON de error
                return JsonResponse(
                    {"error": "The Accept header must be set to 'application/json'."},
                    status=400
                )

            response = self.get_response(request)
        return response
