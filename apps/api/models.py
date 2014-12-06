from django.db import models


def get_json_user_profile(request):
    result = {}
    result["id"] = request.user.id
    result["username"] = request.user.username
    result["email"] = request.user.email
    return result
