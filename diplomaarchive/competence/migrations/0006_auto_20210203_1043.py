# Generated by Django 3.1.3 on 2021-02-03 09:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('competence', '0005_auto_20210202_1956'),
    ]

    operations = [
        migrations.RenameField(
            model_name='keyword',
            old_name='keyword',
            new_name='competence',
        ),
    ]
