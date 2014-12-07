from django.http import HttpResponse

import json


def result_parse(func):
    def wrapper(*args, **kwargs):
        result, status = func(*args, **kwargs)
        return HttpResponse(json.dumps(result), content_type="application/json", status=status)
    return wrapper
