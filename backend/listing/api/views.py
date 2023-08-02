from .serializers import ListingSerializers
from listing.models import Listing
from rest_framework import generics


class ListingList(generics.ListAPIView):
    queryset = Listing.objects.all().order_by('-date_posted')
    serializer_class = ListingSerializers


class ListingCreate(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializers


class ListingDetail(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializers


class ListingDelete(generics.DestroyAPIView):
    queryset = Listing.objects.all()

class ListingUpdate(generics.UpdateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializers


