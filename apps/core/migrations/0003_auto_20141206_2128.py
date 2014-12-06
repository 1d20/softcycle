# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20141206_2128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 6, 21, 28, 59, 592612)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='userachievements',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 6, 21, 28, 59, 592101)),
            preserve_default=True,
        ),
    ]
