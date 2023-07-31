import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Button, Card, CardMedia, CardContent, CardActions, CircularProgress } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

//url import
import urls from './URLS';


// context
import StateContext from './Context/StateContext';


//Assets
import defaultProfilePictue from './Assets/defaultProfilePicture.jpg'






const useStyle = makeStyles()(() => ({

}));


function Agencies() {

    const { classes } = useStyle();
    const usenavigate = useNavigate();
    const globalState = useContext(StateContext);



    const initialstate = {
        dataIsLoading: true,
        agencyList: [],

    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchAgencies':
                draft.agencyList = action.agenciesArray;
                break;
            case 'loadingDone':
                draft.dataIsLoading = false;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


    // request to get all profiles info 
    useEffect(() => {
        async function GetAgencies() {
            try {
                const response = await axios.get(
                    urls.profiles
                );
                dispatch({ type: 'catchAgencies', agenciesArray: response.data })
                dispatch({ type: 'loadingDone' })
                console.log(response);
            } catch (e) {
                console.log(e.response)
            }
        }
        GetAgencies();
    }, [])


    if (state.dataIsLoading === true) {
        return (
            <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
                <CircularProgress />
            </Grid>
        )
    }




    return (
        <Grid
            container
            justifyContent='flex-start'
            spacing={2}
            style={{
                padding: '10px'
            }}
        >
            {state.agencyList.map((agency) => {
                if (agency.agency_name && agency.phone_number) {

                    function PropertiesDisplay() {
                        if (agency.seller_listings.length === 0) {
                            return <Button  disabled size="small">No Properties</Button>
                        }
                        else if (agency.seller_listings.length === 1) {
                            return <Button onClick={() => usenavigate(`/agencies/${agency.seller}`)} size="small">One Property Listed</Button>
                        }
                        else {
                            return <Button onClick={() => usenavigate(`/agencies/${agency.seller}`)} size="small">{agency.seller_listings.length} Properties</Button>
                        }
                    }

                    return (
                        <Grid
                            item
                            key={agency.id}
                            style={{ marginTop: "1rem", maxWidth: "20rem" }}
                        >
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={agency.profile_picture !== null ? agency.profile_picture : defaultProfilePictue}
                                    title="image"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" style={{ textTransform: 'uppercase' }}>
                                        {agency.agency_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {agency.bio.substring(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {PropertiesDisplay()}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                }
            })}
        </Grid>
    )
}

export default Agencies