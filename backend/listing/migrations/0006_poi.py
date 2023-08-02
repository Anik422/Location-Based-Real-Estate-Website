# Generated by Django 4.2.3 on 2023-07-31 10:39

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listing', '0005_alter_listing_area'),
    ]

    operations = [
        migrations.CreateModel(
            name='Poi',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=150, null=True)),
                ('type', models.CharField(choices=[('University', 'University'), ('Hospital', 'Hospital'), ('Stadium', 'Stadium')], max_length=100)),
                ('location', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326)),
            ],
        ),
    ]
