import React, { useEffect } from 'react';
import { useParams, } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Card, CardMedia, CardContent, CardActions, CircularProgress, IconButton } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';


//url import
import urls from './URLS';




//Assets
import defaultProfilePictue from './Assets/defaultProfilePicture.jpg'









function AgencyDetail() {

    const params = useParams();
    const usenavigate = useNavigate();

    const initialstate = {
        dataIsLoading: true,
        userProfile: {
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
            agenciesLists: []
        }
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchUserProfileInfo':
                draft.userProfile.agencyName = action.profile.agency_name;
                draft.userProfile.phoneNumber = action.profile.phone_number;
                draft.userProfile.bio = action.profile.bio;
                draft.userProfile.profilePic = action.profile.profile_picture;
                draft.userProfile.agenciesLists = action.profile.seller_listings;
                break;
            case 'loadingDone':
                draft.dataIsLoading = false;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


    // request to get profile info
    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const profile_url = urls.profiles + `${params.id}/`;
                const response = await axios.get(
                    profile_url
                );
                dispatch({ type: 'catchUserProfileInfo', profile: response.data })
                dispatch({ type: 'loadingDone' })
                console.log(response);
            } catch (e) {
                console.log(e.response)
            }
        }
        GetProfileInfo();
    }, [])

    if (state.dataIsLoading === true) {
        return (
            <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
                <CircularProgress />
            </Grid>
        )
    }





    return (
        <div>
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
                        img
                        style={{ height: "10rem", width: "15rem" }}
                        src={
                            state.userProfile.profilePic !== null ? state.userProfile.profilePic : defaultProfilePictue
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
                                style={{ color: 'green', fontWeight: 'bolder', textTransform: 'uppercase' }}
                            >
                                {state.userProfile.agencyName}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant='h5'
                            style={{ textAlign: 'center', marginTop: '1rem' }}
                        >
                            <IconButton>
                                <LocalPhoneIcon />   {state.userProfile.phoneNumber}
                            </IconButton>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    style={{ marginTop: '1rem', padding: '5px', textAlign: 'justify' }}
                >
                    {state.userProfile.bio}
                </Grid>
            </Grid>

            <Grid
                container
                justifyContent='flex-start'
                spacing={2}
                style={{
                    padding: '10px'
                }}
            >

                {state.userProfile.agenciesLists.map((listing) => {
                    return (
                        <Grid
                            item
                            key={listing.id}
                            style={{ marginTop: "1rem", maxWidth: "20rem" }}
                        >
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={`${urls.path}${listing.picture1}` !== null ? `${urls.path}${listing.picture1}` : defaultProfilePictue}
                                    title="image"
                                    onClick={() => {
                                        usenavigate(`/listings/${listing.id}`)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                        style={{ textTransform: 'uppercase', cursor: 'pointer' }}
                                        onClick={() => {
                                            usenavigate(`/listings/${listing.id}`)
                                        }}
                                    >
                                        {listing.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {listing.description.substring(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {listing.property_status === "Sale" ? (
                                        <Typography>
                                            {listing.listing_type}:
                                            ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Typography>
                                    ) :
                                        (
                                            <Typography>
                                                {listing.listing_type}:
                                                ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / {listing.rental_frequency}
                                            </Typography>
                                        )}
                                </CardActions>
                            </Card>
                        </Grid>
                    );

                })}
            </Grid>
        </div>
    )
}

export default AgencyDetail;