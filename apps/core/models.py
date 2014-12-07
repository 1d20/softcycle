from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

import datetime


class Profile(models.Model):
    user = models.OneToOneField(User, related_name="user_profile")
    waterfall_level = models.IntegerField(default=0)
    score_to_next = models.IntegerField(default=0)

    def get_user_position(self):
        user = self.user
        scores = Score.objects.filter(user=user)
        pos = 0
        if len(scores) != 0:
            pos = scores[0].position.id
        return pos + 1

    def get_user_score(self):
        user = self.user
        result = 0
        scores = Score.objects.filter(user=user)
        if len(scores) == 0:
            return 0
        pos = scores[0].position.id
        for i in range(1, pos + 1):
            try:
                result += scores.filter(position__id=i).order_by(
                    "-score").all()[0].score
            except:
                result += 0
        return result

    def __unicode__(self):
        return str(self.waterfall_level) + " - " + self.user.username + ": " + str(self.score_to_next)


class Position(models.Model):
    title = models.CharField(max_length=255, default="")
    description = models.TextField()

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
        return str(self.position) + ": " + self.user.username + ": " + str(self.score)

    class Meta():
        ordering = ("-position",)


@receiver(post_save, sender=User)
def my_handler(sender, **kwargs):
    try:
        Profile(user=kwargs['instance']).save()
    except:
        pass
