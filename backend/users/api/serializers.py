from rest_framework import serializers #import rest_fremework serializers
from users.models import Profile  #import model
from listing.models import Listing
from listing.api.serializers import ListingSerializers

class ProfileSerializers(serializers.ModelSerializer):
    seller_listings = serializers.SerializerMethodField()

    def get_seller_listings(self, obj):
        query = Listing.objects.filter(seller=obj.seller)
        listing_serializers = ListingSerializers(query, many=True)
        return listing_serializers.data

    class Meta:
        model = Profile
        fields = '__all__'