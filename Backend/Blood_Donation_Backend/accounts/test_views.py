from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST"])
def test_register(request):
    try:
        data = json.loads(request.body)
        return JsonResponse({
            'message': 'Data received successfully',
            'data': data
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)
