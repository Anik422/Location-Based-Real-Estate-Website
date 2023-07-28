from .serializers import ProfileSerializers
from users.models import Profile
from rest_framework import generics


class ProfileListing(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializers


class ProfileDetail(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializers
    lookup_field = 'seller'