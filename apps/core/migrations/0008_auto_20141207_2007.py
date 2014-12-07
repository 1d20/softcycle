# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_profile'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='score',
            options={'ordering': ('-position',)},
        ),
        migrations.AlterField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(related_name='user_profile', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
