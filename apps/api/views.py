from django.shortcuts import render

from apps.core import models as core_models
from utils import result_parse
from . import models

import datetime


@result_parse
def profile(request):
    if request.user.is_authenticated():
        return models.get_json_user_profile(request), 200
    else:
        return {"error": "no authenticated"}, 400


@result_parse
def positions(request):
    return core_models.Position.get_json_positions(), 200


@result_parse
def stage(request, position_id):
    positions = core_models.Position.objects.filter(id=position_id)
    position = positions[0]
    if not request.user.is_authenticated():
        return {"error": "request without user"}, 400
    if len(positions) == 0:
        return {"error": "wrong stage"}, 400

    if request.method == "POST":
        points = request.POST.get("score", None)
        if not points:
            return {"error": "no 'score' in POST params"}, 400
        core_models.Score(user=request.user, position=position,
                          score=points, date=datetime.datetime.now()).save()
    models.update_waterfall(request.user)
    return core_models.Score.get_user_position_json(position, request.user), 200
