# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20141206_2128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='date',
            field=models.DateTimeField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='userachievements',
            name='date',
            field=models.DateTimeField(),
            preserve_default=True,
        ),
    ]
