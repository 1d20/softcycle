# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_position_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='position',
            name='description',
            field=models.TextField(),
            preserve_default=True,
        ),
    ]
