from django.db import models

from apps.core.models import Position, Score


def get_json_user_profile(request):
    result = {}
    result["id"] = request.user.id
    result["username"] = request.user.username
    result["email"] = request.user.email
    result["position"] = request.user.user_profile.get_user_position()
    result["score_now"] = request.user.user_profile.get_user_score()
    result["score_need"] = request.user.user_profile.score_to_next
    if result["score_now"] < result["score_need"]:
        result["position"] = result["position"] - 1
    result["waterfall_level"] = request.user.user_profile.waterfall_level

    return result


def update_waterfall(user):
    def waterfall_position(position, waterfall_level, rate=1.30):
        profile = user.user_profile
        if user.user_profile.get_user_position() == position and \
                profile.waterfall_level < waterfall_level:
            old_score = user.user_profile.get_user_score()
            new_score = int(float(old_score) * rate)
            profile.waterfall_level = waterfall_level
            profile.score_to_next = new_score
            profile.save()

    waterfall_position(6, 1)
    waterfall_position(7, 2)
