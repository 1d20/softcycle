from django.shortcuts import render

from apps.core import models as core_models
from utils import result_parse
from . import models


@result_parse
def profile(request):
    if request.user.is_authenticated():
        return models.get_json_user_profile(request), 200
    else:
        return {"error": "no authenticated"}, 400


@result_parse
def positions(request):
    return core_models.Position.get_json_positions(), 200
