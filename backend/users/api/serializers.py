from rest_framework import serializers #import rest_fremework serializers
from users.models import Profile  #import model


class ProfileSerializers(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'