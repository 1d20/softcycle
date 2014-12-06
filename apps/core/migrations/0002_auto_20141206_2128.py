# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 6, 21, 28, 58, 576319)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='userachievements',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 6, 21, 28, 58, 575815)),
            preserve_default=True,
        ),
    ]
