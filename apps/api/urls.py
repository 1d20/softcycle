from django.conf.urls import patterns, include, url
import views

urlpatterns = patterns(
    '',
    url(r'profile/$', views.profile),
    url(r'positions/$', views.positions),
    url(r'positions/(?P<position_id>\d+)/$', views.position),
    url(r'highscores/$', views.highscores),
    url(r'highscores/(?P<position_id>\d+)/$', views.highscore),
    url(r'stage/(?P<position_id>\d+)/$', views.stage),
)
