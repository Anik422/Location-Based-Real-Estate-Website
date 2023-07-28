from rest_framework import serializers #import rest_fremework serializers
from listing.models import Listing #import model


class ListingSerializers(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    seller_username = serializers.SerializerMethodField()
    seller_agency_name = serializers.SerializerMethodField()

    def get_seller_agency_name(self, obj):
        return obj.seller.profile.agency_name

    def get_seller_username(self, obj):
        return obj.seller.username

    def get_country(self, obj):
        return "England"
    class Meta:
        model = Listing
        fields = '__all__'