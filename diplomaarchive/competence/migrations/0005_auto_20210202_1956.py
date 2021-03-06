# Generated by Django 3.1.3 on 2021-02-02 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competence', '0004_exemption_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competence',
            name='name',
            field=models.CharField(max_length=200, unique=True),
        ),
        migrations.AlterField(
            model_name='exemption',
            name='status',
            field=models.CharField(choices=[('a', 'Goedgekeurd'), ('r', 'Afgewezen'), ('p', 'In Behandeling')], default='p', max_length=1),
        ),
    ]
