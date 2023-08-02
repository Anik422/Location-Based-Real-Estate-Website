
from django.urls import path
# Listing Api Views
from .api.views import ListingList, ListingCreate, ListingDetail, ListingDelete, ListingUpdate
# user api views
from users.api.views import ProfileListing, ProfileDetail, ProfileUpdate


urlpatterns = [ 
   path("listings/", ListingList.as_view(), name="listings"),
   path("listings/<int:pk>/", ListingDetail.as_view(), name="listingDetail"),
   path("listings/<int:pk>/update/", ListingUpdate.as_view(), name="listingUpdate"),
   path("listings/<int:pk>/delete/", ListingDelete.as_view(), name="listingDelete"),
   path("listing/create/", ListingCreate.as_view(), name="listings"),
   path("profiles/", ProfileListing.as_view(), name="profiles"),
   path("profiles/<int:seller>/", ProfileDetail.as_view(), name="profileDetail"),
   path("profiles/<int:seller>/update/", ProfileUpdate.as_view(), name="profileUpdate"),
]
