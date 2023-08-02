from django.contrib import admin
from .models import Listing, Poi
from .forms import PoiForm
# # from django.contrib.gis.geos import Point

# # Register your models here

class PoiAdmin(admin.ModelAdmin):
    # initial_data = {'location': Point(0, 0, srid=4326)}  # Replace (0, 0) with your desired default coordinates
    form = PoiForm

admin.site.register(Listing)
admin.site.register(Poi, PoiAdmin)
