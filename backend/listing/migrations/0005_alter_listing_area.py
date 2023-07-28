# Generated by Django 4.2.3 on 2023-07-28 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listing', '0004_remove_listing_location_listing_latitude_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='area',
            field=models.CharField(blank=True, choices=[('Inner London', 'Inner London'), ('Outer London', 'Outer London')], max_length=50, null=True),
        ),
    ]
