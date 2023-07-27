from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

# import user models
from django.contrib.auth import get_user_model
User = get_user_model()




class Listing(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    choices_area = (
        ("Inner London", "Inner London"),
        ("Outer London", "Outer London"),
    )
    area = models.CharField(max_length=50, blank=True, null=True, choices=choices_area)
    borough = models.CharField(max_length=100, blank=True, null=True)
    choices_listing_type = (
        ("House", "House"),
        ("Apartment", "Apartment"),
        ("Office", "Office"),
    )
    listing_type = models.CharField(max_length=50, choices=choices_listing_type)
    choices_property_status = (
        ("Sale", "Sale"),
        ("Rent", "Rent"),
    )
    property_status =models.CharField(max_length=50, blank=True, null=True, choices=choices_property_status)
    price = models.DecimalField(max_digits=50, decimal_places=0)
    choices_rental_frequency = (
        ("Month", "Month"),
        ("Week", "Week"),
        ("Day", "Day"),
    )
    rental_frequency = models.CharField(max_length=50, blank=True, null=True, choices=choices_rental_frequency)
    rooms = models.IntegerField(blank=True, null=True)
    furnished = models.BooleanField(default=False)
    pool = models.BooleanField(default=False)
    elevator = models.BooleanField(default=False)
    cctv = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    date_posted = models.DateTimeField(auto_now_add=True)
    # location = models.PointField(blank=True, null=True, srid=4326)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    picture1 = models.ImageField(blank=True, null=True, upload_to='pictures/%Y/%m/%d/')
    picture2 = models.ImageField(blank=True, null=True, upload_to='pictures/%Y/%m/%d/')
    picture3 = models.ImageField(blank=True, null=True, upload_to='pictures/%Y/%m/%d/')
    picture4 = models.ImageField(blank=True, null=True, upload_to='pictures/%Y/%m/%d/')
    picture5 = models.ImageField(blank=True, null=True, upload_to='pictures/%Y/%m/%d/')

    def __str__(self):
        return self.title


