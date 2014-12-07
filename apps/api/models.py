from django.db import models

from apps.core.models import Position, Score


def get_json_user_profile(request):
    result = {}
    print request.user.user_profile.get_user_position()
    result["id"] = request.user.id
    result["username"] = request.user.username
    result["email"] = request.user.email
    result["position"] = request.user.user_profile.get_user_position()
    result["score_now"] = request.user.user_profile.get_user_score()
    result["score_need"] = request.user.user_profile.score_to_next

    return result
