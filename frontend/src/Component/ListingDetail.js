import React, { useEffect, useState, useContext } from 'react';
import { useParams, } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


//react leaflet
import { MapContainer, Popup, TileLayer, useMap, Marker } from 'react-leaflet'
import { Icon } from 'leaflet';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Card, CardMedia, TextField, CircularProgress, IconButton, Breadcrumbs, Link, Button } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { makeStyles } from 'tss-react/mui';
import RoomIcon from '@mui/icons-material/Room';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


//url import
import urls from './URLS';



//Assets
import defaultProfilePictue from './Assets/defaultProfilePicture.jpg'
import stadiumIconPng from './Assets/Mapicons/stadium.png'
import hospitalIconPng from './Assets/Mapicons/hospital.png'
import universityIconPng from './Assets/Mapicons/university.png'

// context
import StateContext from './Context/StateContext';


//component
import ListingUpdate from './ListingUpdate';





const useStyle = makeStyles()(() => ({
    sliderContainer: {
        position: 'relative',
        marginTop: "1rem",
    },
    leftArrow: {
        position: 'absolute',
        cursor: 'pointer',
        fontSize: '3rem',
        color: 'white',
        top: '50%',
        left: '27.5%',
        "&:hover": {
            backgroundColor: 'green',
        }
    },
    rightArrow: {
        position: 'absolute',
        cursor: 'pointer',
        fontSize: '3rem',
        color: 'white',
        top: '50%',
        right: '27.5%',
        "&:hover": {
            backgroundColor: 'green',
        }
    },
}));




function ListingDetail() {
    const params = useParams();
    const usenavigate = useNavigate();
    const { classes } = useStyle();
    const globalState = useContext(StateContext);

    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [updateOpen, setUpdateOpen] = useState(false);

    const updateHandleClickOpen = () => {
        setUpdateOpen(true);
    };
  
    const updateHandleClose = () => {
        setUpdateOpen(false);
    };


    const stadiumIcon = new Icon({
        iconUrl: stadiumIconPng,
        iconSize: [40, 40],
    });
    const hospitalIcon = new Icon({
        iconUrl: hospitalIconPng,
        iconSize: [40, 40],
    });
    const universityIcon = new Icon({
        iconUrl: universityIconPng,
        iconSize: [40, 40],
    });




    const initialstate = {
        dataIsLoading: true,
        listingInfo: '',
        sellerProfileInfo: '',
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchListingInfo':
                draft.listingInfo = action.listingObject;
                break;
            case 'catchSellerProfileInfo':
                draft.sellerProfileInfo = action.profileObject;
                break;
            case 'loadingDone':
                draft.dataIsLoading = false;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


    // request to get listing  info
    useEffect(() => {
        async function GetListingInfo() {
            try {
                const profile_url = urls.listings + `${params.id}/`;
                const response = await axios.get(
                    profile_url
                );
                dispatch({ type: 'catchListingInfo', listingObject: response.data })
                console.log(response.data)
            } catch (e) {
                console.log(e.response)
            }
        }
        GetListingInfo();
    }, [])



    // request to get profile info
    useEffect(() => {
        if (state.listingInfo) {
            async function GetProfileInfo() {
                try {
                    const profile_url = urls.profiles + `${state.listingInfo.seller}/`;
                    const response = await axios.get(
                        profile_url
                    );
                    dispatch({ type: 'catchSellerProfileInfo', profileObject: response.data })
                    dispatch({ type: 'loadingDone' })
                } catch (e) {
                    console.log(e.response)
                }
            }
            GetProfileInfo();
        }
    }, [state.listingInfo])

    const listingPictures = [
        state.listingInfo.picture1,
        state.listingInfo.picture2,
        state.listingInfo.picture3,
        state.listingInfo.picture4,
        state.listingInfo.picture5].filter((picture) => picture !== null);

    const [currentpicture, setCurrentpicture] = useState(0);

    function PreviousPicture() {
        if (currentpicture === 0) {
            return setCurrentpicture(listingPictures.length - 1);
        } else {
            return setCurrentpicture(currentValue => currentValue - 1)
        }
    };

    function NextPicture() {
        if (currentpicture === listingPictures.length - 1) {
            return setCurrentpicture(0);
        } else {
            return setCurrentpicture(currentValue => currentValue + 1)
        }
    };

    const date = new Date(state.listingInfo.date_posted);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    if (state.dataIsLoading === true) {
        return (
            <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
                <CircularProgress />
            </Grid>
        )
    }



    async function DeleteHandler() {
        try {
            const response = await axios.delete(
                urls.listings + `${params.id}/delete/`,
            );
            console.log(response.data);
            usenavigate('/listings');
        } catch (e) {
            console.log(e.response.data)
        }
    };

    return (
        <div style={{ margin: '0 2rem 2rem 2rem' }}>
            <Grid item style={{ marginTop: '1rem' }}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            onClick={() => usenavigate('/listings')}
                            style={{ cursor: 'pointer' }}
                        >
                            Listings
                        </Link>
                        <Typography
                            color="text.primary"
                        >
                            {state.listingInfo.title}
                        </Typography>
                    </Breadcrumbs>
                </div>
            </Grid>
            {/* image slider */}
            {listingPictures.length > 0 ? (
                <Grid item container justifyContent='center' className={classes.sliderContainer}>
                    {listingPictures.map((picture, index) => {
                        return (
                            <div key={index}>
                                {index === currentpicture ? (
                                    <input
                                        type="image"
                                        img="true"
                                        src={picture}
                                        alt="listin image"
                                        style={{
                                            width: '55rem',
                                            height: '35rem',
                                        }}
                                    />) : ""}
                            </div>
                        )
                    })}
                    <ArrowCircleLeftIcon onClick={PreviousPicture} className={classes.leftArrow} />
                    <ArrowCircleRightIcon onClick={NextPicture} className={classes.rightArrow} />
                </Grid>
            ) : ""}

            {/* more information */}
            <Grid
                item
                container
                style={{
                    padding: '1rem',
                    border: '1px solid black',
                    marginTop: '1rem',
                }}
            >
                <Grid item container direction='column' xs={7} spacing={1}>
                    <Grid item>
                        <Typography variant='h5'>{state.listingInfo.title}</Typography>
                    </Grid>
                    <Grid item>
                        <RoomIcon />
                        <Typography variant='h6'>{state.listingInfo.borough}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle1'>{formattedDate}</Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={5} alignItems='center'>
                    <Typography variant='h6' style={{ fontWeight: 'bolder', color: 'green' }}>
                        {state.listingInfo.listing_type} | {state.listingInfo.property_status === 'Sale' ? `$${state.listingInfo.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : `$${state.listingInfo.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / ${state.listingInfo.rental_frequency}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                item
                container
                justifyContent='space-between'
                style={{
                    padding: '1rem',
                    border: '1px solid black',
                    marginTop: '1rem',
                }}>
                {state.listingInfo.rooms ? (
                    <Grid xs={2} item style={{ display: 'flex' }}>
                        <Typography variant='h6'>{state.listingInfo.rooms} Rooms</Typography>
                    </Grid>

                ) : ''}
                {state.listingInfo.furnished ? (
                    <Grid xs={2} item style={{ display: 'flex' }}>
                        <CheckBoxIcon style={{ color: 'green', fontSize: '2rem' }} /> <Typography variant='h6'>Furnished</Typography>
                    </Grid>

                ) : ''}
                {state.listingInfo.pool ? (
                    <Grid xs={2} item style={{ display: 'flex' }}>
                        <CheckBoxIcon style={{ color: 'green', fontSize: '2rem' }} /> <Typography variant='h6'>Pool</Typography>
                    </Grid>

                ) : ''}
                {state.listingInfo.elevator ? (
                    <Grid xs={2} item style={{ display: 'flex' }}>
                        <CheckBoxIcon style={{ color: 'green', fontSize: '2rem' }} /> <Typography variant='h6'>Elevator</Typography>
                    </Grid>

                ) : ''}
                {state.listingInfo.cctv ? (
                    <Grid xs={2} item style={{ display: 'flex' }}>
                        <CheckBoxIcon style={{ color: 'green', fontSize: '2rem' }} /> <Typography variant='h6'>CCTV</Typography>
                    </Grid>

                ) : ''}
                {state.listingInfo.parking ? (
                    <Grid xs={2} item style={{ display: 'flex' }}>
                        <CheckBoxIcon style={{ color: 'green', fontSize: '2rem' }} /> <Typography variant='h6'>Parking</Typography>
                    </Grid>

                ) : ''}
            </Grid>
            <Grid
                item
                style={{
                    padding: '1rem',
                    border: '1px solid black',
                    marginTop: '1rem',
                }}
            >
                <Typography variant='h5' style={{ fontWeight: 'bolder' }}>Description:</Typography>
                <Typography variant='h5' style={{ textAlign: 'justify' }}>{state.listingInfo.description}</Typography>
            </Grid>

            {/* seller info */}
            <Grid
                container
                style={{
                    width: '50%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '3rem',
                    border: '5px solid black',
                    padding: '1rem',
                    borderRadius: "15px",
                    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                }}
            >
                <Grid item xs={6}>
                    <input
                        type="image"
                        img="true"
                        style={{ height: "10rem", width: "15rem", cursor: 'pointer' }}
                        onClick={() => usenavigate(`/agencies/${state.sellerProfileInfo.seller}`)}
                        src={
                            state.sellerProfileInfo.profile_picture !== null ? state.sellerProfileInfo.profile_picture : defaultProfilePictue
                        }
                        alt='agency image'
                    />
                </Grid>
                <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    xs={6}
                >

                    <Grid item>
                        <Typography
                            variant='h5'
                            style={{ textAlign: 'center', marginTop: '1rem' }}
                        >
                            <span
                                style={{ color: 'green', fontWeight: 'bolder', textTransform: 'uppercase', cursor: 'pointer' }}
                                onClick={() => usenavigate(`/agencies/${state.sellerProfileInfo.seller}`)}
                            >
                                {state.sellerProfileInfo.agency_name}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant='h5'
                            style={{ textAlign: 'center', marginTop: '1rem' }}
                        >
                            <IconButton>
                                <LocalPhoneIcon />   {state.sellerProfileInfo.phone_number}
                            </IconButton>
                        </Typography>
                    </Grid>
                </Grid>
                {globalState.userId == state.listingInfo.seller ? (
                    <Grid item container justifyContent='space-around'>
                        <Button variant='contained' color='primary' onClick={updateHandleClickOpen}>Update</Button>

                        <Dialog open={updateOpen} fullScreen>
                            <ListingUpdate listingData={state.listingInfo} onClose={updateHandleClose} />
                        </Dialog>


                        <Button
                            variant='contained'
                            color='error'
                            onClick={handleClickOpen}
                        >Delete</Button>
                        <Dialog
                            fullScreen={fullScreen}
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                {"Confirm Delete?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete {state.listingInfo.title}?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={handleClose}>
                                    Disagree
                                </Button>
                                <Button onClick={DeleteHandler} autoFocus>
                                    Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                ) : ""}
            </Grid>

            {/* map */}
            <Grid item container style={{ marginTop: '1rem' }} spacing={1} justifyContent='space-between'>
                <Grid
                    item
                    xs={3}
                    style={{
                        overflow: 'auto',
                        height: '35rem'
                    }}
                >
                    {state.listingInfo.listing_pois_within_10K.map((poi) => {

                        function DegreeToRadian(coordinate) {
                            return coordinate * Math.PI / 180;
                        };

                        function CalculateDistance() {
                            const latitude1 = DegreeToRadian(state.listingInfo.latitude);
                            const longitude1 = DegreeToRadian(state.listingInfo.longitude);

                            const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
                            const longitude2 = DegreeToRadian(poi.location.coordinates[1]);
                            // The formula
                            const latDiff = latitude2 - latitude1;
                            const lonDiff = longitude2 - longitude1;
                            const R = 6371000 / 1000;

                            const a =
                                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                                Math.cos(latitude1) *
                                Math.cos(latitude2) *
                                Math.sin(lonDiff / 2) *
                                Math.sin(lonDiff / 2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                            const d = R * c;

                            const dist =
                                Math.acos(
                                    Math.sin(latitude1) * Math.sin(latitude2) +
                                    Math.cos(latitude1) *
                                    Math.cos(latitude2) *
                                    Math.cos(lonDiff)
                                ) * R;
                            return dist.toFixed(2);
                        };

                        return (
                            <div
                                key={poi.id}
                                style={{
                                    marginBottom: '0.5rem',
                                    border: '1px solid black'
                                }}
                            >
                                <Typography variant='h6'>
                                    {poi.name}
                                </Typography>
                                <Typography variant='subtitle'>
                                    {poi.type} | <span style={{ fontWeight: 'bold', color: 'green' }}>{CalculateDistance()} Kilometers</span>
                                </Typography>
                            </div>
                        );
                    })}
                </Grid>
                <Grid item xs={9} style={{ height: "35rem" }}>
                    <MapContainer center={[state.listingInfo.latitude, state.listingInfo.longitude]} zoom={14} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[state.listingInfo.latitude, state.listingInfo.longitude]}>
                            <Popup>{state.listingInfo.title}</Popup>
                        </Marker>
                        {state.listingInfo.listing_pois_within_10K.map((poi) => {
                            const IconDisplay = () => {
                                if (poi.type === 'University') {
                                    return universityIcon;
                                } else if (poi.type === 'Hospital') {
                                    return hospitalIcon;
                                } else if (poi.type === 'Stadium') {
                                    return stadiumIcon;
                                }
                            }
                            return (
                                <Marker key={poi.id} icon={IconDisplay()} position={[poi.location.coordinates[0], poi.location.coordinates[1]]}>
                                    <Popup>
                                        {poi.name}
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MapContainer>
                </Grid>
            </Grid>
        </div>
    )
}

export default ListingDetail;