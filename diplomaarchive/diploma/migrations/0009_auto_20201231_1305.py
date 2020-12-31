# Generated by Django 3.1.3 on 2020-12-31 12:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diploma', '0008_auto_20201230_1147'),
    ]

    operations = [
        migrations.AddField(
            model_name='diploma',
            name='back_img',
            field=models.ImageField(blank=True, upload_to='photos/%Y/%m/%d/'),
        ),
        migrations.AddField(
            model_name='diploma',
            name='front_img',
            field=models.ImageField(blank=True, upload_to='photos/%Y/%m/%d/'),
        ),
        migrations.AlterField(
            model_name='diploma',
            name='competences',
            field=models.ManyToManyField(to='diploma.Competence'),
        ),
    ]
