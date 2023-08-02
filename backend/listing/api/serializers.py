from rest_framework import serializers #import rest_fremework serializers
from listing.models import Listing, Poi #import model
from django.contrib.gis.measure import D
from django.contrib.gis.geos import Point


class ListingSerializers(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    seller_username = serializers.SerializerMethodField()
    seller_agency_name = serializers.SerializerMethodField()
    listing_pois_within_10K = serializers.SerializerMethodField()
     

    def get_listing_pois_within_10K(self, obj):
        listing_location = Point(obj.latitude, obj.longitude, srid=4326)
        query = Poi.objects.filter(location__distance_lte=(listing_location, D(km=10)))
        query_serialized = PoiSerializers(query, many=True)
        return query_serialized.data
    
    def get_seller_agency_name(self, obj):
        return obj.seller.profile.agency_name

    def get_seller_username(self, obj):
        return obj.seller.username

    def get_country(self, obj):
        return "England"
    class Meta:
        model = Listing
        fields = '__all__'


class PoiSerializers(serializers.ModelSerializer):
    class Meta:
        model = Poi
        fields = '__all__'