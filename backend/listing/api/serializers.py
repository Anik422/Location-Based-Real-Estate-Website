from rest_framework import serializers #import rest_fremework serializers
from listing.models import Listing #import model


class ListingSerializers(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'