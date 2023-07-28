
from django.urls import path
# Listing Api Views
from .api.views import ListingList, ListingCreate
# user api view
from users.api.views import ProfileListing, ProfileDetail
urlpatterns = [ 
   path("listings/", ListingList.as_view(), name="listings"),
   path("listing/create/", ListingCreate.as_view(), name="listings"),
   path("profiles/", ProfileListing.as_view(), name="profiles"),
   path("profiles/<int:seller>/", ProfileDetail.as_view(), name="profileDetail"),
]
