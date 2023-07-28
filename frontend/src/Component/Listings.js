import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useImmerReducer } from 'use-immer';

//react leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

//MUI 
import { Grid, AppBar, Typography, Button, Card, CardHeader, CardMedia, CardContent, CircularProgress, IconButton, CardActions } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import RoomIcon from '@mui/icons-material/Room';


//map icons
import houseIconPng from './Assets/Mapicons/house.png';
import apartmentIconPng from './Assets/Mapicons/apartment.png';
import officeIconPng from './Assets/Mapicons/office.png';



//DummyData
// import myListing from './Assets/Data/Dummydata'
// import polygonOne from './Shape'

//url import
import urls from './URLS';



const useStyle = makeStyles()(() => ({
  cardStyle: {
    margin: "0.5rem",
    border: '1px solid black',
    position: 'relative',
  },
  pictureStyle: {
    paddingRight: "1rem",
    paddingLeft: "1rem",
    height: '20rem',
    width: "30rem"
  },
  priceOverlay: {
    position: "absolute",
    backgroundColor: "green",
    zIndex: "1000",
    color: "white",
    top: "100px",
    left: "20px",
    padding: "5px",
    borderRadius: "10px",
    fontWeight: '500'
  },

}));


function Listings() {

  // fetch('http://127.0.0.1:8000/api/listings/')
  //   .then(response => response.json())
  //   .then(data => console.log(data));



  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });
  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });
  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });


  const initialstate = {
    mapInstance: null,
  };

  function ReduceFunction(draft, action) {
    switch (action.type) {
      case 'getMap':
        draft.mapInstance = action.mapData;
        break;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


  function TheMapComponent() {
    const map = useMap()
    dispatch({ type: 'getMap', mapData: map });
    return null
  };




  const polylineOne = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ]

  const { classes } = useStyle();


  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();
    async function GetAllListing() {
      try {
        const response = await axios.get(urls.listings, { cancelToken: source.token });
        setAllListings(response.data);
        setDataIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    GetAllListing();
    return () => {
      source.cancel();
    }
  }, [])
  if (dataIsLoading === false) {
    console.log(allListings[0].location);
  }
  if (dataIsLoading === true) {
    return (
      <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    )
  }
  return (
    <Grid container>
      <Grid item xs={4} data-aos="zoom-in-up">
        {allListings.map((listing) => {
          return (
            <Card
              key={listing.id}
              className={classes.cardStyle}
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-duration="1500"
            >
              <CardHeader
                action={
                  <IconButton aria-label="settings" onClick={() => state.mapInstance.flyTo([listing.latitude, listing.longitude], 16)}>
                    <RoomIcon />
                  </IconButton>
                }
                title={listing.title}
              />
              <CardMedia
                className={classes.pictureStyle}
                data-aos="zoom-in-up"
                component="img"
                image={listing.picture1}
                alt={listing.title}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {listing.description.substring(0, 200)}...
                </Typography>
              </CardContent>
              {listing.property_status === "Sale" ? (
                <Typography className={classes.priceOverlay}>
                  {listing.listing_type}:
                  ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Typography>
              ) :
                (
                  <Typography className={classes.priceOverlay}>
                    {listing.listing_type}:
                    ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / {listing.rental_frequency}
                  </Typography>
                )}
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                 {listing.seller_username}
                </IconButton>
              </CardActions>
            </Card>
          )
        })}
      </Grid>
      <Grid item xs={8} style={{ marginTop: '0.5rem' }}>
        <AppBar data-aos="zoom-in-up" position='sticky'>
          <div style={{ height: '100vh' }}>
            <MapContainer center={[51.53796304347224, -0.10189113898462315]} zoom={10} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <TheMapComponent />

              {allListings.map((listing) => {
                const IconDisplay = () => {
                  if (listing.listing_type === 'House') {
                    return houseIcon;
                  } else if (listing.listing_type === 'Apartment') {
                    return apartmentIcon;
                  } else if (listing.listing_type === 'Office') {
                    return officeIcon;
                  }
                }
                return (
                  <Marker
                    key={listing.id}
                    icon={IconDisplay()}
                    position={[listing.latitude, listing.longitude,]}>
                    <Popup>
                      <Typography variant='h5' >{listing.title}</Typography>
                      <input type="image" img alt='image' src={listing.picture1} style={{ height: "14rem", width: "18rem" }} />
                      <Typography variant='body1' >{listing.description.substring(0, 150)}...</Typography>
                      <Button variant='contained' fullWidth>Details</Button>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  )
}

export default Listings

