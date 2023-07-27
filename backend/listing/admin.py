from django.contrib import admin
from .models import Listing
# from .forms import ListingForm
# # from django.contrib.gis.geos import Point

# # Register your models here

# class ListingAdmin(admin.ModelAdmin):
#     # initial_data = {'location': Point(0, 0, srid=4326)}  # Replace (0, 0) with your desired default coordinates
#     form = ListingForm

admin.site.register(Listing)
