import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

//url import
import urls from './URLS';


// context
import StateContext from './Context/StateContext';






const useStyle = makeStyles()(() => ({
    fromContainer: {
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '3rem',
        border: '5px solid black',
        padding: '3rem',
        borderRadius: "15px",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    },
    loginBtn: {
        backgroundColor: 'green',
        color: 'white',
        fontSize: '1.1rem',
        marginRight: '1rem',
        transition: 'all .3s ease-in-out',
        '&:hover': {
            backgroundColor: 'blue',
            color: 'black',
        }
    },
    picturesBtn: {
        backgroundColor: 'blue',
        color: 'white',
        fontSize: '0.8rem',
        marginRight: '1rem',
        border: '1px solid black',
    },
}));



function ProfileUpdate(props) {

    const { classes } = useStyle();
    const usenavigate = useNavigate();
    const globalState = useContext(StateContext);



    const initialstate = {
        agencyNameValue: props.userProfile.agencyName,
        phoneNumberValue: props.userProfile.phoneNumber,
        bioValue: props.userProfile.bio,
        uploadedPicture: [],
        profilePictureValue: props.userProfile.profilePic,
        sendRequest: 0,
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchAgencyNameChange':
                draft.agencyNameValue = action.agencyNameChosen;
                break;
            case 'catchPhoneNumberChange':
                draft.phoneNumberValue = action.phoneNumberChosen;
                break;
            case 'catchBioChange':
                draft.bioValue = action.bioChosen;
                break;
            case 'catchUploadedpicture':
                draft.uploadedPicture = action.pictureChosen;
                break;
            case 'catchProfilePictureChange':
                draft.profilePictureValue = action.profilePictureChosen;
                break;
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest + 1;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


    //use effect to cath uploaded picture
    useEffect(() => {
        if (state.uploadedPicture[0]) {
            dispatch({ type: 'catchProfilePictureChange', profilePictureChosen: state.uploadedPicture[0] });
        }
    }, state.uploadedPicture[0]);



    // useEffect to send the request
    useEffect(() => {
        if (state.sendRequest) {
            async function UpdateProfile() {
                const fromData = new FormData();

                if(typeof state.profilePictureValue === 'string' || state .profilePictureValue === null){
                    fromData.append('agency_name', state.agencyNameValue);
                    fromData.append('phone_number', state.phoneNumberValue);
                    fromData.append('bio', state.bioValue);
                    fromData.append('seller', globalState.userId);
                }else{
                    fromData.append('agency_name', state.agencyNameValue);
                    fromData.append('phone_number', state.phoneNumberValue);
                    fromData.append('bio', state.bioValue);
                    fromData.append('profile_picture', state.profilePictureValue);
                    fromData.append('seller', globalState.userId);
                }


                try {
                    const profile_update_url = urls.profiles + `${globalState.userId}/update/`;
                    const response = await axios.patch(
                        profile_update_url,
                        fromData,
                    );
                    console.log(response);
                    usenavigate(0)
                } catch (e) {
                    console.log(e.response);
                }

            };
            UpdateProfile();
        }

    }, [state.sendRequest]);


    function FromSubmit(e) {
        e.preventDefault();
        dispatch({ type: 'changeSendRequest' })
    };

    function ProfilePictureDisplay() {
        if (typeof state.profilePictureValue != 'string') {
            return (
                <ul>
                    {state.profilePictureValue ? <li>{state.profilePictureValue.name}</li> : ""}
                </ul>
            )
        }
        else if (typeof state.profilePictureValue === 'string') {
            return (
                <Grid
                    item
                    style={{
                        marginTop: '0.5rem',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                    }}
                >
                    <img
                        style={{
                            height: '5rem',
                            width: "5rem"
                        }}
                        src={props.userProfile.profilePic} />
                </Grid>
            )
        }
    };

    return (
        <>
            <div className={classes.fromContainer} data-aos="zoom-in-up">
                <form onSubmit={FromSubmit}>
                    <Grid item container justifyContent="center">
                        <Typography variant='h4'>MY PROFILE</Typography>
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="agencyName"
                            label="Agency Name"
                            variant="outlined"
                            fullWidth
                            value={state.agencyNameValue}
                            onChange={(e) => dispatch({ type: 'catchAgencyNameChange', agencyNameChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="phoneNumber"
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            value={state.phoneNumberValue}
                            onChange={(e) => dispatch({ type: 'catchPhoneNumberChange', phoneNumberChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="bio"
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            value={state.bioValue}
                            onChange={(e) => dispatch({ type: 'catchBioChange', bioChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container>
                        {ProfilePictureDisplay()}
                    </Grid>
                    <Grid item container xs={6} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Button
                            className={classes.picturesBtn}
                            variant='contained'
                            fullWidth
                            required
                            component='label'
                        >PROFILE PICTURE
                            <input type='file'
                                accept='image/png, image/gif, image/jpeg'
                                hidden
                                onChange={(e) => {
                                    dispatch({ type: 'catchUploadedpicture', pictureChosen: e.target.files })
                                }}
                            />
                        </Button>
                    </Grid>

                    <Grid item container xs={8} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Button className={classes.loginBtn} variant='contained' fullWidth type='submit'>UPDATE</Button>
                    </Grid>
                </form>
            </div>
        </>
    )
}

export default ProfileUpdate;