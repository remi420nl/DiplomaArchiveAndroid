# Generated by Django 3.1.3 on 2021-02-07 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competence', '0006_auto_20210203_1043'),
        ('diploma', '0009_auto_20210119_1823'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diploma',
            name='competences',
            field=models.ManyToManyField(blank=True, null=True, to='competence.Competence'),
        ),
    ]
