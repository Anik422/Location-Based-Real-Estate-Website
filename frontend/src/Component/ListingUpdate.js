import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Snackbar, Typography, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { makeStyles } from 'tss-react/mui';


//url import
import urls from './URLS';


// context
import StateContext from './Context/StateContext';








const useStyle = makeStyles()(() => ({
    fromContainer: {
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '3rem',
        border: '5px solid black',
        padding: '3rem',
        borderRadius: "15px",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    },
    updateBtn: {
        fontSize: '1.1rem',
        marginRight: '1rem',
    },
    cancelBtn: {
        fontSize: '1.1rem',
        marginRight: '1rem',
    },


}));



const listingTypeOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'House',
        label: 'House',
    },
    {
        value: 'Apartment',
        label: 'Apartment',
    },
    {
        value: 'Office',
        label: 'Office',
    },
];

const propertyStatusoption = [
    {
        value: '',
        label: '',
    },
    {
        value: 'Sale',
        label: 'Sale',
    },
    {
        value: 'Rent',
        label: 'Rent',
    },
];

const rentalFrequencyOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'Month',
        label: 'Month',
    },
    {
        value: 'Week',
        label: 'Week',
    },
    {
        value: 'Day',
        label: 'Day',
    },
];

function ListingUpdate(props) {

    const { classes } = useStyle();
    const usenavigate = useNavigate();
    const globalState = useContext(StateContext);


    const initialstate = {
        titleValue: props.listingData.title,
        listingTypeValue: props.listingData.listing_type,
        descriptionValue: props.listingData.description,
        propertyStatusValue: props.listingData.property_status,
        priceValue: props.listingData.price,
        rentalFrequencyValue: props.listingData.rental_frequency,
        roomsValue: props.listingData.rooms,
        furnishedValue: props.listingData.furnished,
        poolValue: props.listingData.pool,
        elevatorValue: props.listingData.elevator,
        cctvValue: props.listingData.cctv,
        parkingValue: props.listingData.parking,
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false,
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchTitleChange':
                draft.titleValue = action.titleChosen;
                break;
            case 'catchListingTypeChange':
                draft.listingTypeValue = action.listingTypeChosen;
                break;
            case 'catchDescriptionChange':
                draft.descriptionValue = action.descriptionChosen;
                break;
            case 'catchPropertyStatusChange':
                draft.propertyStatusValue = action.propertyStatusChosen;
                break;
            case 'catchPriceChange':
                draft.priceValue = action.priceChosen;
                break;
            case 'catchRentalFrequencyChange':
                draft.rentalFrequencyValue = action.rentalFrequencyChosen;
                break;
            case 'catchRoomsChange':
                draft.roomsValue = action.roomsChosen;
                break;
            case 'catchFurnishedChange':
                draft.furnishedValue = action.furnishedChosen;
                break;
            case 'catchPoolChange':
                draft.poolValue = action.poolChosen;
                break;
            case 'catchElevatorChange':
                draft.elevatorValue = action.elevatorChosen;
                break;
            case 'catchCctvChange':
                draft.cctvValue = action.cctvChosen;
                break;
            case 'catchParkingChange':
                draft.parkingValue = action.parkingChosen;
                break;
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest + 1;
                break;
            case 'catchOpenSnack':
                draft.openSnack = true;
                break;
            case 'disabledTheBtn':
                draft.disabledBtn = true;
                break;
            case 'allowTheButton':
                draft.disabledBtn = false;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);





    //Form submit function
    function fromSubmit(e) {
        e.preventDefault();
        console.log('The From is submit.');
        dispatch({ type: 'changeSendRequest' })
        dispatch({ type: 'disabledTheBtn' })
    }

    useEffect(() => {
        if (state.sendRequest) {
            const source = axios.CancelToken.source();
            async function UpdateProperty() {
                const fromData = new FormData();
                if (state.listingTypeValue === 'Office') {
                    fromData.append('title', state.titleValue);
                    fromData.append('description', state.descriptionValue);
                    fromData.append('listing_type', state.listingTypeValue);
                    fromData.append('property_status', state.propertyStatusValue);
                    fromData.append('price', state.priceValue);
                    fromData.append('rental_frequency', state.rentalFrequencyValue);
                    fromData.append('rooms', 0);
                    fromData.append('furnished', state.furnishedValue);
                    fromData.append('pool', state.poolValue);
                    fromData.append('elevator', state.elevatorValue);
                    fromData.append('cctv', state.cctvValue);
                    fromData.append('parking', state.parkingValue);
                    fromData.append('seller', globalState.userId);
                }
                else {
                    fromData.append('title', state.titleValue);
                    fromData.append('description', state.descriptionValue);
                    fromData.append('listing_type', state.listingTypeValue);
                    fromData.append('property_status', state.propertyStatusValue);
                    fromData.append('price', state.priceValue);
                    fromData.append('rental_frequency', state.rentalFrequencyValue);
                    fromData.append('rooms', state.roomsValue);
                    fromData.append('furnished', state.furnishedValue);
                    fromData.append('pool', state.poolValue);
                    fromData.append('elevator', state.elevatorValue);
                    fromData.append('cctv', state.cctvValue);
                    fromData.append('parking', state.parkingValue);
                    fromData.append('seller', globalState.userId);
                }
                try {
                    const response = await axios.patch(
                        urls.listings + `${props.listingData.id}/update/`,
                        fromData,
                        {
                            cancelToken: source.token
                        }
                    );
                    // console.log(response);
                    dispatch({ type: 'catchOpenSnack' })

                } catch (e) {
                    console.log(e.response);
                    dispatch({ type: 'allowTheButton' })
                }

            };
            UpdateProperty();
            return () => {
                source.cancel();
            }
        }

    }, [state.sendRequest]);

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                usenavigate(0);
            }, 1500)
        }
    }, [state.openSnack]);



    // price lable display function
    function PriceDisplay() {
        if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue === 'Day') {
            return 'Price per Day';
        }
        else if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue === 'Week') {
            return 'Price per Week';
        }
        else if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue === 'Month') {
            return 'Price per Month';
        }
        else {
            return 'Price';
        }
    };




    return (
        <>
            <div className={classes.fromContainer} data-aos="zoom-in-up">
                <form onSubmit={fromSubmit}>
                    <Grid item container justifyContent="center">
                        <Typography variant='h4'>UPDATE LISTING</Typography>
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="title"
                            label="Title"
                            required
                            variant="standard"
                            fullWidth
                            value={state.titleValue}
                            onChange={(e) => dispatch({ type: 'catchTitleChange', titleChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container justifyContent='space-between'>
                        <Grid item xs={5} style={{ marginTop: '1rem' }}>
                            <TextField
                                id="listingType"
                                label="Listing Type"
                                variant="standard"
                                required
                                fullWidth
                                value={state.listingTypeValue}
                                onChange={(e) => dispatch({ type: 'catchListingTypeChange', listingTypeChosen: e.target.value })}
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {listingTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={5} style={{ marginTop: '1rem' }}>
                            <TextField
                                id="propertyStatus"
                                label="Property Status"
                                variant="standard"
                                fullWidth
                                required
                                value={state.propertyStatusValue}
                                onChange={(e) => dispatch({ type: 'catchPropertyStatusChange', propertyStatusChosen: e.target.value })}
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {propertyStatusoption.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Grid item container justifyContent='space-between'>
                        <Grid item xs={4} style={{ marginTop: '1rem' }}>
                            <TextField
                                id="rentalFrequency"
                                label="Rental Frequency"
                                variant="standard"
                                disabled={state.propertyStatusValue === 'Sale' ? true : false}
                                fullWidth
                                value={state.propertyStatusValue === 'Sale' ? "" : state.rentalFrequencyValue}
                                onChange={(e) => dispatch({ type: 'catchRentalFrequencyChange', rentalFrequencyChosen: e.target.value })}
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {rentalFrequencyOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={4} style={{ marginTop: '1rem' }}>
                            <TextField
                                id="price"
                                type='number'
                                required
                                label={PriceDisplay()}
                                variant="standard"
                                fullWidth
                                value={state.priceValue}
                                onChange={(e) => dispatch({ type: 'catchPriceChange', priceChosen: e.target.value })}
                            />
                        </Grid>
                        {state.listingTypeValue === 'Office' ? '' : (<Grid item container xs={3} style={{ marginTop: '1rem', }}>
                            <TextField
                                id="rooms"
                                label="Rooms"
                                type='number'
                                variant="standard"
                                fullWidth
                                value={state.roomsValue}
                                onChange={(e) => dispatch({ type: 'catchRoomsChange', roomsChosen: e.target.value })}
                            />
                        </Grid>)}

                    </Grid>

                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            required
                            multiline
                            rows={6}
                            fullWidth
                            value={state.descriptionValue}
                            onChange={(e) => dispatch({ type: 'catchDescriptionChange', descriptionChosen: e.target.value })}
                        />
                    </Grid>

                    <Grid item container justifyContent='space-between'>
                        <Grid item xs={2} style={{ marginTop: '1rem' }}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.furnishedValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchFurnishedChange',
                                        furnishedChosen: e.target.checked
                                    })} />}
                                label="Furnished"
                            />
                        </Grid>
                        <Grid item xs={2} style={{ marginTop: '1rem' }}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.poolValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchPoolChange',
                                        poolChosen: e.target.checked
                                    })} />}
                                label="Pool"
                            />
                        </Grid>
                        <Grid item xs={2} style={{ marginTop: '1rem' }}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.elevatorValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchElevatorChange',
                                        elevatorChosen: e.target.checked
                                    })} />}
                                label="Elevator"
                            />
                        </Grid>
                        <Grid item xs={2} style={{ marginTop: '1rem' }}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.cctvValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchCctvChange',
                                        cctvChosen: e.target.checked
                                    })} />}
                                label="Cctv"
                            />
                        </Grid>
                        <Grid item xs={2} style={{ marginTop: '1rem' }}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={state.parkingValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchParkingChange',
                                        parkingChosen: e.target.checked
                                    })} />}
                                label="Parking"
                            />
                        </Grid>
                    </Grid>

                    <Grid item container xs={9} style={{ marginTop: '2rem', marginLeft: 'auto', marginRight: 'auto' }} justifyContent='space-between' alignItems='center'>
                        <Grid item xs={4}>
                            <Button
                                fullWidth
                                variant='contained'
                                className={classes.cancelBtn}
                                onClick={props.onClose}
                                color="error"
                            >
                                CANCEL
                            </Button>
                        </Grid>
                        <Grid item xs={4} >
                            <Button variant='contained'
                                type='submit'
                                color="success"
                                fullWidth
                                disabled={state.disabledBtn}
                                className={classes.updateBtn}>
                                UPDATE
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Snackbar
                open={state.openSnack}
                autoHideDuration={6000}
                message="You have successfully logged in"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            />
        </>
    );
}

export default ListingUpdate

