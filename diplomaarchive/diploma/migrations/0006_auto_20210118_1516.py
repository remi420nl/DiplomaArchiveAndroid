# Generated by Django 3.1.3 on 2021-01-18 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diploma', '0005_auto_20210118_1451'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diploma',
            name='date',
            field=models.DateField(null=True),
        ),
    ]