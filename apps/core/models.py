from django.db import models
from django.contrib.auth.models import User


import datetime


class Position(models.Model):
    title = models.CharField(max_length=255, default="")

    def __unicode__(self):
        return str(self.id) + " - " + self.title


class Achievements(models.Model):
    title = models.CharField(max_length=255, default="")
    description = models.TextField()
    image = models.ImageField()

    def __unicode__(self):
        return self.title


class UserAchievements(models.Model):
    user = models.ForeignKey(User)
    achievement = models.ForeignKey(Achievements)
    date = models.DateTimeField()

    def __unicode__(self):
        return self.user.username + ": " + self.achievement


class Score(models.Model):
    user = models.ForeignKey(User)
    position = models.ForeignKey(Position, default=1)
    score = models.IntegerField()
    date = models.DateTimeField()

    def __unicode__(self):
        return self.user.username + ": "
