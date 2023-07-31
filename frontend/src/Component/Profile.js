import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, CircularProgress, Button } from '@mui/material';


//url import
import urls from './URLS';

//Assets
import defaultProfilePictue from './Assets/defaultProfilePicture.jpg' 


// context
import StateContext from './Context/StateContext';

//component
import ProfileUpdate from './ProfileUpdate';





function Profile() {

    const globalState = useContext(StateContext);
    const usenavigate = useNavigate();

    const initialstate = {
        dataIsLoading: true,
        userProfile: {
            agencyName: '',
            phoneNumber: '',
            profilePic: '',
            bio: '',
            sellerId: '',
            sellerListing: []
        }
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchUserProfileInfo':
                draft.userProfile.agencyName = action.profile.agency_name;
                draft.userProfile.phoneNumber = action.profile.phone_number;
                draft.userProfile.bio = action.profile.bio;
                draft.userProfile.profilePic = action.profile.profile_picture;
                draft.userProfile.sellerListing = action.profile.seller_listings;
                draft.userProfile.sellerId = action.profile.seller;
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
                const profile_url = urls.profiles + `${globalState.userId}/`;
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

    // useEffect to send the request
    useEffect(() => {
        if (state.sendRequest) {
            async function UpdateProfile() {
                const fromData = new FormData();
                fromData.append('agency_name', state.agencyNameValue);
                fromData.append('phone_number', state.phoneNumberValue);
                fromData.append('bio', state.bioValue);
                fromData.append('profile_picture', state.profilePictureValue);
                fromData.append('seller', globalState.userId);

                try {
                    const profile_update_url = urls.profiles + `${globalState.userId}/update/`;
                    const response = await axios.patch(
                        profile_update_url,
                        fromData,
                    );
                    console.log(response);
                    // usenavigate('/losting')
                } catch (e) {
                    console.log(e.response);
                }

            };
            UpdateProfile();
        }

    }, [state.sendRequest]);



    function PropertiesDisplay() {
        if (state.userProfile.sellerListing.length === 0) {
            return <Button disabled size="small">No Property</Button>
        }
        else if (state.userProfile.sellerListing.length === 1) {
            return <Button onClick={() => usenavigate(`/agencies/${state.userProfile.sellerId}`)} size="small">One Property Listed</Button>
        }
        else {
            return <Button onClick={() => usenavigate(`/agencies/${state.userProfile.sellerId}`)} size="small">{state.userProfile.sellerListing.length} Properties</Button>
        }
    }


    function WelcomeDisplay() {
        if (state.userProfile.agencyName === null ||
            state.userProfile.agencyName === '' ||
            state.userProfile.phoneNumber === null ||
            state.userProfile.phoneNumber === '') {
            return (
                <Typography
                    variant='h5'
                    style={{ textAlign: 'center', marginTop: '1rem' }}
                >
                    Welcome <Link to='/profile'
                        style={{ color: 'green', fontWeight: 'bolder', cursor: 'pointer', textDecoration: 'none' }}
                    >
                        {globalState.userUsername}
                    </Link>
                    , please submit this form below to update your profile.
                </Typography>
            )
        } else {
            return (
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
                        <img
                            style={{ height: "10rem", width: "15rem" }}
                            src={
                                state.userProfile.profilePic !== null ? state.userProfile.profilePic : defaultProfilePictue
                            }
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
                                Welcome <Link to='/profile'
                                    style={{ color: 'green', fontWeight: 'bolder', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    {globalState.userUsername}
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant='h5'
                                style={{ textAlign: 'center', marginTop: '1rem' }}
                            >
                                You have {PropertiesDisplay()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
    }

    if (state.dataIsLoading === true) {
        return (
          <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
            <CircularProgress />
          </Grid>
        )
      }

    return (
        <>
            <div>
                {WelcomeDisplay()}
            </div>

            <ProfileUpdate userProfile={state.userProfile} />
        </>
    )
}

export default Profile;