# Generated by Django 3.1.3 on 2021-02-13 08:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_course_context'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='context',
            new_name='description',
        ),
    ]