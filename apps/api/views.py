from django.shortcuts import render
from utils import result_parse
import models


@result_parse
def profile(request):
    if request.user.is_authenticated():
        return models.get_json_user_profile(request), 200
    else:
        return {"error": "no authenticated"}, 400
