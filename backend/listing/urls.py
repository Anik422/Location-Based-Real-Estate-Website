
from django.urls import path
# Listing Api Views
from .api.views import ListingList, ListingCreate

urlpatterns = [ 
   path("listings/", ListingList.as_view(), name="listings"),
   path("listing/create/", ListingCreate.as_view(), name="listings"),
]
