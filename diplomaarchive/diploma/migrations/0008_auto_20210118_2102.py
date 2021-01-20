# Generated by Django 3.1.3 on 2021-01-18 20:02

import diploma.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diploma', '0007_auto_20210118_1614'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diploma',
            name='back_img',
            field=models.FileField(blank=True, upload_to=diploma.models.upload_path),
        ),
        migrations.AlterField(
            model_name='diploma',
            name='front_img',
            field=models.FileField(blank=True, upload_to=diploma.models.upload_path),
        ),
    ]
