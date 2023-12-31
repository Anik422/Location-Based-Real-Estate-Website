import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Snackbar, Alert, Typography, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

//react leaflet
import { MapContainer, Polygon, TileLayer, useMap, Marker } from 'react-leaflet'

//url import
import urls from './URLS';


// context
import StateContext from './Context/StateContext';

//Boroughs
import Camden from "./Assets/Boroughs/Camden";
import Greenwich from "./Assets/Boroughs/Greenwich";
import Hackney from "./Assets/Boroughs/Hackney";
import Hammersmith from "./Assets/Boroughs/Hammersmith";
import Islington from "./Assets/Boroughs/Islington";
import Kensington from "./Assets/Boroughs/Kensington";
import Lambeth from "./Assets/Boroughs/Lambeth";
import Lewisham from "./Assets/Boroughs/Lewisham";
import Southwark from "./Assets/Boroughs/Southwark";
import Hamlets from "./Assets/Boroughs/Hamlets";
import Wandsworth from "./Assets/Boroughs/Wandsworth";
import Westminster from "./Assets/Boroughs/Westminster";
import City_of_London from "./Assets/Boroughs/City_of_London";
import Barking from "./Assets/Boroughs/Barking";
import Barnet from "./Assets/Boroughs/Barnet";
import Bexley from "./Assets/Boroughs/Bexley";
import Brent from "./Assets/Boroughs/Brent";
import Bromley from "./Assets/Boroughs/Bromley";
import Croydon from "./Assets/Boroughs/Croydon";
import Ealing from "./Assets/Boroughs/Ealing";
import Enfield from "./Assets/Boroughs/Enfield";
import Haringey from "./Assets/Boroughs/Haringey";
import Harrow from "./Assets/Boroughs/Harrow";
import Havering from "./Assets/Boroughs/Havering";
import Hillingdon from "./Assets/Boroughs/Hillingdon";
import Hounslow from "./Assets/Boroughs/Hounslow";
import Kingston from "./Assets/Boroughs/Kingston";
import Merton from "./Assets/Boroughs/Merton";
import Newham from "./Assets/Boroughs/Newham";
import Redbridge from "./Assets/Boroughs/Redbridge";
import Richmond from "./Assets/Boroughs/Richmond";
import Sutton from "./Assets/Boroughs/Sutton";
import Waltham from "./Assets/Boroughs/Waltham";







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
    registerBtn: {
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

const areaOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'Inner London',
        label: 'Inner London',
    },
    {
        value: 'Outer London',
        label: 'Outer London',
    },

];

const innerLondonOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "Camden",
        label: "Camden",
    },
    {
        value: "Greenwich",
        label: "Greenwich",
    },
    {
        value: "Hackney",
        label: "Hackney",
    },
    {
        value: "Hammersmith and Fulham",
        label: "Hammersmith and Fulham",
    },
    {
        value: "Islington",
        label: "Islington",
    },
    {
        value: "Kensington and Chelsea",
        label: "Kensington and Chelsea",
    },
    {
        value: "Lambeth",
        label: "Lambeth",
    },
    {
        value: "Lewisham",
        label: "Lewisham",
    },
    {
        value: "Southwark",
        label: "Southwark",
    },
    {
        value: "Tower Hamlets",
        label: "Tower Hamlets",
    },
    {
        value: "Wandsworth",
        label: "Wandsworth",
    },
    {
        value: "Westminster",
        label: "Westminster",
    },
    {
        value: "City of London",
        label: "City of London",
    },
];

const outerLondonOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "Barking and Dangenham",
        label: "Barking and Dangenham",
    },
    {
        value: "Barnet",
        label: "Barnet",
    },
    {
        value: "Bexley",
        label: "Bexley",
    },
    {
        value: "Brent",
        label: "Brent",
    },
    {
        value: "Bromley",
        label: "Bromley",
    },
    {
        value: "Croydon",
        label: "Croydon",
    },
    {
        value: "Ealing",
        label: "Ealing",
    },
    {
        value: "Enfield",
        label: "Enfield",
    },
    {
        value: "Haringey",
        label: "Haringey",
    },
    {
        value: "Harrow",
        label: "Harrow",
    },
    {
        value: "Havering",
        label: "Havering",
    },
    {
        value: "Hillingdon",
        label: "Hillingdon",
    },
    {
        value: "Hounslow",
        label: "Hounslow",
    },
    {
        value: "Kingston upon Thames",
        label: "Kingston upon Thames",
    },
    {
        value: "Merton",
        label: "Merton",
    },
    {
        value: "Newham",
        label: "Newham",
    },
    {
        value: "Redbridge",
        label: "Redbridge",
    },
    {
        value: "Richmond upon Thames",
        label: "Richmond upon Thames",
    },
    {
        value: "Sutton",
        label: "Sutton",
    },
    {
        value: "Waltham Forest",
        label: "Waltham Forest",
    },
];


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

function AddProperty() {

    const { classes } = useStyle();
    const usenavigate = useNavigate();
    const globalState = useContext(StateContext);


    const initialstate = {
        titleValue: '',
        listingTypeValue: '',
        descriptionValue: '',
        areaValue: '',
        boroughValue: '',
        latitudeValue: '',
        longitudeValue: '',
        propertyStatusValue: '',
        priceValue: '',
        rentalFrequencyValue: '',
        roomsValue: '',
        furnishedValue: false,
        poolValue: false,
        elevatorValue: false,
        cctvValue: false,
        parkingValue: false,
        picture1Value: '',
        picture2Value: '',
        picture3Value: '',
        picture4Value: '',
        picture5Value: '',
        mapInstance: null,
        markerPosition: {
            lat: '51.505',
            lng: '-0.09',
        },
        uploadedPictures: [],
        sendRequest: 0,
        userProfile: {
            agencyName: '',
            phoneNumber: '',
        },
        openSnack: false,
        disabledBtn: false,
        titleErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        listingTypeErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        propertyStatusErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        priceErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        areaErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        boroughErrors: {
            hasErrors: false,
            errorMessage: '',
        },
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchTitleChange':
                draft.titleValue = action.titleChosen;
                draft.titleErrors.hasErrors = false;
                draft.titleErrors.errorMessage = "";
                break;
            case 'catchListingTypeChange':
                draft.listingTypeValue = action.listingTypeChosen;
                draft.listingTypeErrors.hasErrors = false;
                draft.listingTypeErrors.errorMessage = "";
                break;
            case 'catchDescriptionChange':
                draft.descriptionValue = action.descriptionChosen;
                break;
            case 'catchAreaChange':
                draft.areaValue = action.areaChosen;
                draft.areaErrors.hasErrors = false;
                draft.areaErrors.errorMessage = "";
                break;
            case 'catchBoroughChange':
                draft.boroughValue = action.boroughChosen;
                draft.boroughErrors.hasErrors = false;
                draft.boroughErrors.errorMessage = "";
                break;

            case 'catchLatitudeChange':
                draft.latitudeValue = action.latitudeChosen;
                break;
            case 'catchLongitudeChange':
                draft.longitudeValue = action.longitudeChosen;
                break;
            case 'catchPropertyStatusChange':
                draft.propertyStatusValue = action.propertyStatusChosen;
                draft.propertyStatusErrors.hasErrors = false;
                draft.propertyStatusErrors.errorMessage = "";
                break;
            case 'catchPriceChange':
                draft.priceValue = action.priceChosen;
                draft.priceErrors.hasErrors = false;
                draft.priceErrors.errorMessage = "";
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
            case 'catchPicture1Change':
                draft.picture1Value = action.picture1Chosen;
                break;
            case 'catchPicture2Change':
                draft.picture2Value = action.picture2Chosen;
                break;
            case 'catchPicture3Change':
                draft.picture3Value = action.picture3Chosen;
                break;
            case 'catchPicture4Change':
                draft.picture4Value = action.picture4Chosen;
                break;
            case 'catchPicture5Change':
                draft.picture5Value = action.picture5Chosen;
                break;
            case 'getMap':
                draft.mapInstance = action.mapData;
                break;
            case 'changeMarkerPosition':
                draft.markerPosition.lat = action.changeLatitude;
                draft.markerPosition.lng = action.changeLongitude;
                draft.latitudeValue = '';
                draft.longitudeValue = '';
                break;
            case 'catchUploadedpictures':
                draft.uploadedPictures = action.picturesChosen;
                break;
            case 'changeSendRequest':
                draft.sendRequest = draft.sendRequest + 1;
                break;
            case 'catchUserProfileInfo':
                draft.userProfile.agencyName = action.profile.agency_name;
                draft.userProfile.phoneNumber = action.profile.phone_number;
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
            case 'catchTitleErrors':
                if (action.titleChosen.length === 0) {
                    draft.titleErrors.hasErrors = true;
                    draft.titleErrors.errorMessage = "This field must not be empty";
                }
                break;
            case 'catchListingTypeErrors':
                if (action.listingTypeChosen.length === 0) {
                    draft.listingTypeErrors.hasErrors = true;
                    draft.listingTypeErrors.errorMessage = "This field must not be empty";
                }
                break;
            case 'catchPropertyStatusErrors':
                if (action.propertyStatusChosen.length === 0) {
                    draft.propertyStatusErrors.hasErrors = true;
                    draft.propertyStatusErrors.errorMessage = "This field must not be empty";
                }
                break;
            case 'catchPriceErrors':
                if (action.priceChosen.length === 0) {
                    draft.priceErrors.hasErrors = true;
                    draft.priceErrors.errorMessage = "This field must not be empty";
                }
                break;
            case 'catchAreaErrors':
                if (action.areaChosen.length === 0) {
                    draft.areaErrors.hasErrors = true;
                    draft.areaErrors.errorMessage = "This field must not be empty";
                }
                break;
            case 'catchBoroughErrors':
                if (action.boroughChosen.length === 0) {
                    draft.boroughErrors.hasErrors = true;
                    draft.boroughErrors.errorMessage = "This field must not be empty";
                }
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);





    function TheMapComponent() {
        const map = useMap();
        dispatch({ type: 'getMap', mapData: map });
        return null
    };


    // Changing the map view depending on the chosen borough
    useEffect(() => {
        if (state.boroughValue === "Camden") {
            state.mapInstance.flyTo([51.54103467179952, -0.14870897037846917], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.54103467179952,
                changeLongitude: -0.14870897037846917,
            });
        } else if (state.boroughValue === "Greenwich") {
            state.mapInstance.flyTo([51.486316313935134, 0.005925763550159742], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.486316313935134,
                changeLongitude: 0.005925763550159742,
            });
        } else if (state.boroughValue === "Hackney") {
            state.mapInstance.flyTo([51.55421119118178, -0.061054618357071246], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.55421119118178,
                changeLongitude: -0.061054618357071246,
            });
        } else if (state.boroughValue === "Hammersmith and Fulham") {
            state.mapInstance.flyTo([51.496961673854216, -0.22495912738555046], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.496961673854216,
                changeLongitude: -0.22495912738555046,
            });
        } else if (state.boroughValue === "Islington") {
            state.mapInstance.flyTo([51.54974373783584, -0.10746608414711818], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.54974373783584,
                changeLongitude: -0.10746608414711818,
            });
        } else if (state.boroughValue === "Kensington and Chelsea") {
            state.mapInstance.flyTo([51.49779579272461, -0.1908227388030137], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.49779579272461,
                changeLongitude: -0.1908227388030137,
            });
        } else if (state.boroughValue === "Lambeth") {
            state.mapInstance.flyTo([51.457598293463874, -0.12030697867735651], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.457598293463874,
                changeLongitude: -0.12030697867735651,
            });
        } else if (state.boroughValue === "Lewisham") {
            state.mapInstance.flyTo([51.45263474786279, -0.017657579903930083], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.45263474786279,
                changeLongitude: -0.017657579903930083,
            });
        } else if (state.boroughValue === "Southwark") {
            state.mapInstance.flyTo([51.47281414549159, -0.07657080658293915], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.47281414549159,
                changeLongitude: -0.07657080658293915,
            });
        } else if (state.boroughValue === "Tower Hamlets") {
            state.mapInstance.flyTo([51.52222760075287, -0.03427379217816716], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.52222760075287,
                changeLongitude: -0.03427379217816716,
            });
        } else if (state.boroughValue === "Wandsworth") {
            state.mapInstance.flyTo([51.45221859319854, -0.1910578642162312], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.45221859319854,
                changeLongitude: -0.1910578642162312,
            });
        } else if (state.boroughValue === "Westminster") {
            state.mapInstance.flyTo([51.51424692365236, -0.1557886924596714], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.51424692365236,
                changeLongitude: -0.1557886924596714,
            });
        } else if (state.boroughValue === "City of London") {
            state.mapInstance.flyTo([51.51464652712437, -0.09207257068971077], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.51464652712437,
                changeLongitude: -0.09207257068971077,
            });
        } else if (state.boroughValue === "Barking and Dangenham") {
            state.mapInstance.flyTo([51.54475354441844, 0.13730036835406337], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.54475354441844,
                changeLongitude: 0.13730036835406337,
            });
        } else if (state.boroughValue === "Barnet") {
            state.mapInstance.flyTo([51.61505810569654, -0.20104146847921367], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.61505810569654,
                changeLongitude: -0.20104146847921367,
            });
        } else if (state.boroughValue === "Bexley") {
            state.mapInstance.flyTo([51.45784336604241, 0.1386755093498764], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.45784336604241,
                changeLongitude: 0.1386755093498764,
            });
        } else if (state.boroughValue === "Brent") {
            state.mapInstance.flyTo([51.55847917911348, -0.2623697479848262], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.55847917911348,
                changeLongitude: -0.2623697479848262,
            });
        } else if (state.boroughValue === "Bromley") {
            state.mapInstance.flyTo([51.37998089785619, 0.056091833685512606], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.37998089785619,
                changeLongitude: 0.056091833685512606,
            });
        } else if (state.boroughValue === "Croydon") {
            state.mapInstance.flyTo([51.36613815034951, -0.08597242883896719], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.36613815034951,
                changeLongitude: -0.08597242883896719,
            });
        } else if (state.boroughValue === "Ealing") {
            state.mapInstance.flyTo([51.52350664933499, -0.33384540332179463], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.52350664933499,
                changeLongitude: -0.33384540332179463,
            });
        } else if (state.boroughValue === "Enfield") {
            state.mapInstance.flyTo([51.650718869158275, -0.07999628038008409], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.650718869158275,
                changeLongitude: -0.07999628038008409,
            });
        } else if (state.boroughValue === "Haringey") {
            state.mapInstance.flyTo([51.591214467057085, -0.10319530898095737], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.591214467057085,
                changeLongitude: -0.10319530898095737,
            });
        } else if (state.boroughValue === "Harrow") {
            state.mapInstance.flyTo([51.60218606442213, -0.33540294600548437], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.60218606442213,
                changeLongitude: -0.33540294600548437,
            });
        } else if (state.boroughValue === "Havering") {
            state.mapInstance.flyTo([51.57230623503768, 0.2256095005492423], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.57230623503768,
                changeLongitude: 0.2256095005492423,
            });
        } else if (state.boroughValue === "Hillingdon") {
            state.mapInstance.flyTo([51.5430033964411, -0.4435905982156584], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.5430033964411,
                changeLongitude: -0.4435905982156584,
            });
        } else if (state.boroughValue === "Hounslow") {
            state.mapInstance.flyTo([51.475988836438525, -0.3660060903075389], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.475988836438525,
                changeLongitude: -0.3660060903075389,
            });
        } else if (state.boroughValue === "Kingston upon Thames") {
            state.mapInstance.flyTo([51.39401320084246, -0.2841003136670212], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.39401320084246,
                changeLongitude: -0.2841003136670212,
            });
        } else if (state.boroughValue === "Merton") {
            state.mapInstance.flyTo([51.41148120353897, -0.18805584151013174], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.41148120353897,
                changeLongitude: -0.18805584151013174,
            });
        } else if (state.boroughValue === "Newham") {
            state.mapInstance.flyTo([51.533282275935306, 0.031692014878610064], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.533282275935306,
                changeLongitude: 0.031692014878610064,
            });
        } else if (state.boroughValue === "Redbridge") {
            state.mapInstance.flyTo([51.585885574074965, 0.07764760021283491], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.585885574074965,
                changeLongitude: 0.07764760021283491,
            });
        } else if (state.boroughValue === "Richmond upon Thames") {
            state.mapInstance.flyTo([51.450368976651696, -0.30801386088548505], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.450368976651696,
                changeLongitude: -0.30801386088548505,
            });
        } else if (state.boroughValue === "Sutton") {
            state.mapInstance.flyTo([51.363672040828504, -0.1702200806863363], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.363672040828504,
                changeLongitude: -0.1702200806863363,
            });
        } else if (state.boroughValue === "Waltham Forest") {
            state.mapInstance.flyTo([51.59466635701797, -0.012215840493378892], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.59466635701797,
                changeLongitude: -0.012215840493378892,
            });
        }
    }, [state.boroughValue]);


    //Borough display function
    function BoroughDisplay() {
        if (state.boroughValue === "Camden") {
            return <Polygon positions={Camden} />;
        } else if (state.boroughValue === "Greenwich") {
            return <Polygon positions={Greenwich} />;
        } else if (state.boroughValue === "Hackney") {
            return <Polygon positions={Hackney} />;
        } else if (state.boroughValue === "Hammersmith and Fulham") {
            return <Polygon positions={Hammersmith} />;
        } else if (state.boroughValue === "Islington") {
            return <Polygon positions={Islington} />;
        } else if (state.boroughValue === "Kensington and Chelsea") {
            return <Polygon positions={Kensington} />;
        } else if (state.boroughValue === "Lambeth") {
            return <Polygon positions={Lambeth} />;
        } else if (state.boroughValue === "Lewisham") {
            return <Polygon positions={Lewisham} />;
        } else if (state.boroughValue === "Southwark") {
            return <Polygon positions={Southwark} />;
        } else if (state.boroughValue === "Tower Hamlets") {
            return <Polygon positions={Hamlets} />;
        } else if (state.boroughValue === "Wandsworth") {
            return <Polygon positions={Wandsworth} />;
        } else if (state.boroughValue === "Westminster") {
            return <Polygon positions={Westminster} />;
        } else if (state.boroughValue === "City of London") {
            return <Polygon positions={City_of_London} />;
        } else if (state.boroughValue === "Barking and Dangenham") {
            return <Polygon positions={Barking} />;
        } else if (state.boroughValue === "Barnet") {
            return <Polygon positions={Barnet} />;
        } else if (state.boroughValue === "Bexley") {
            return <Polygon positions={Bexley} />;
        } else if (state.boroughValue === "Brent") {
            return <Polygon positions={Brent} />;
        } else if (state.boroughValue === "Bromley") {
            return <Polygon positions={Bromley} />;
        } else if (state.boroughValue === "Croydon") {
            return <Polygon positions={Croydon} />;
        } else if (state.boroughValue === "Ealing") {
            return <Polygon positions={Ealing} />;
        } else if (state.boroughValue === "Enfield") {
            return <Polygon positions={Enfield} />;
        } else if (state.boroughValue === "Haringey") {
            return <Polygon positions={Haringey} />;
        } else if (state.boroughValue === "Harrow") {
            return <Polygon positions={Harrow} />;
        } else if (state.boroughValue === "Havering") {
            return <Polygon positions={Havering} />;
        } else if (state.boroughValue === "Hillingdon") {
            return <Polygon positions={Hillingdon} />;
        } else if (state.boroughValue === "Hounslow") {
            return <Polygon positions={Hounslow} />;
        } else if (state.boroughValue === "Kingston upon Thames") {
            return <Polygon positions={Kingston} />;
        } else if (state.boroughValue === "Merton") {
            return <Polygon positions={Merton} />;
        } else if (state.boroughValue === "Newham") {
            return <Polygon positions={Newham} />;
        } else if (state.boroughValue === "Redbridge") {
            return <Polygon positions={Redbridge} />;
        } else if (state.boroughValue === "Richmond upon Thames") {
            return <Polygon positions={Richmond} />;
        } else if (state.boroughValue === "Sutton") {
            return <Polygon positions={Sutton} />;
        } else if (state.boroughValue === "Waltham Forest") {
            return <Polygon positions={Waltham} />;
        }
    };


    //Draggable Marker

    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                dispatch({ type: 'catchLatitudeChange', latitudeChosen: marker.getLatLng().lat })
                dispatch({ type: 'catchLongitudeChange', longitudeChosen: marker.getLatLng().lng })
            },
        }),
        [],
    )

    //catch picture fields
    useEffect(() => {
        if (state.uploadedPictures[0]) {
            dispatch({ type: 'catchPicture1Change', picture1Chosen: state.uploadedPictures[0] });
        }

    }, [state.uploadedPictures[0]]);

    useEffect(() => {
        if (state.uploadedPictures[1]) {
            dispatch({ type: 'catchPicture2Change', picture2Chosen: state.uploadedPictures[1] });
        }
    }, [state.uploadedPictures[1]]);

    useEffect(() => {
        if (state.uploadedPictures[2]) {
            dispatch({ type: 'catchPicture3Change', picture3Chosen: state.uploadedPictures[2] });
        }
    }, [state.uploadedPictures[2]]);

    useEffect(() => {
        if (state.uploadedPictures[3]) {
            dispatch({ type: 'catchPicture4Change', picture4Chosen: state.uploadedPictures[3] });
        }
    }, [state.uploadedPictures[3]]);

    useEffect(() => {
        if (state.uploadedPictures[4]) {
            dispatch({ type: 'catchPicture5Change', picture5Chosen: state.uploadedPictures[4] });
        }
    }, [state.uploadedPictures[4]]);


    // request to get profile info
    useEffect(() => {
        // const source = axios.CancelToken.source();
        async function GetProfileInfo() {
            try {

                const profile_url = urls.profiles + `${globalState.userId}/`;
                console.log(profile_url);
                const response = await axios.get(
                    profile_url
                );
                dispatch({ type: 'catchUserProfileInfo', profile: response.data })
                console.log(response);
            } catch (e) {
                console.log(e.response)
            }
        }
        GetProfileInfo();
        // return () => {
        //     source.cancel();
        // }
    }, [])


    //Form submit function
    function fromSubmit(e) {
        e.preventDefault();
        if (!state.titleErrors.hasErrors &&
            !state.listingTypeErrors.hasErrors &&
            !state.propertyStatusErrors.hasErrors &&
            !state.priceErrors.hasErrors &&
            !state.areaErrors.hasErrors &&
            !state.boroughErrors.hasErrors &&
            state.latitudeValue &&
            state.latitudeValue) {
            dispatch({ type: 'changeSendRequest' })
            dispatch({ type: 'disabledTheBtn' })
        }
    }

    useEffect(() => {
        if (state.sendRequest) {
            const source = axios.CancelToken.source();
            async function addProperty() {
                const fromData = new FormData();
                fromData.append('title', state.titleValue);
                fromData.append('description', state.descriptionValue);
                fromData.append('area', state.areaValue);
                fromData.append('borough', state.boroughValue);
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
                fromData.append('latitude', state.latitudeValue);
                fromData.append('longitude', state.longitudeValue);
                fromData.append('picture1', state.picture1Value);
                fromData.append('picture2', state.picture2Value);
                fromData.append('picture3', state.picture3Value);
                fromData.append('picture4', state.picture4Value);
                fromData.append('picture5', state.picture5Value);
                fromData.append('seller', globalState.userId);
                try {
                    await axios.post(
                        urls.listingCreate,
                        fromData,
                        {
                            cancelToken: source.token
                        }
                    );
                    dispatch({ type: 'catchOpenSnack' })
                } catch (e) {
                    dispatch({ type: 'allowTheButton' })
                    console.log(e.response);
                }

            };
            addProperty();
            return () => {
                source.cancel();
            }
        }

    }, [state.sendRequest]);




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


    function submitButtonDisplay() {
        console.log(globalState.userIsLogged, state.userProfile.agencyName, state.userProfile.phoneNumber);
        if (globalState.userIsLogged &&
            state.userProfile.agencyName !== null &&
            state.userProfile.agencyName !== '' &&
            state.userProfile.phoneNumber !== null &&
            state.userProfile.phoneNumber !== '') {
            return (
                <Button variant='contained'
                    type='submit'
                    fullWidth
                    disabled={state.disabledBtn}
                    className={classes.registerBtn}>

                    SUBMIT
                </Button>
            )
        }
        else if (globalState.userIsLogged &&
            (state.userProfile.agencyName === null ||
                state.userProfile.agencyName === '') && (
                state.userProfile.phoneNumber === null ||
                state.userProfile.phoneNumber === '')) {
            return (
                <Button variant='outlined'
                    fullWidth
                    className={classes.registerBtn}>
                    COMPLITE YOUR PROFILE TO ADD PROPERTY
                </Button>
            )
        }
        else if (!globalState.userIsLogged) {
            return (
                <Button variant='outlined'
                    onClick={() => usenavigate('/login')}
                    fullWidth
                    className={classes.registerBtn}>
                    SIGN IN TO ADD A PROPERTY
                </Button>
            )
        }
    }


    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                usenavigate('/listings')
            }, 1500)
        }
    }, [state.openSnack]);


    return (
        <>
            <div className={classes.fromContainer} data-aos="zoom-in-up">
                <form onSubmit={fromSubmit}>
                    <Grid item container justifyContent="center">
                        <Typography variant='h4'>SUBMIT A PROPERTY</Typography>
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
                            onBlur={(e) => dispatch({ type: 'catchTitleErrors', titleChosen: e.target.value })}
                            error={state.titleErrors.hasErrors ? true : false}
                            helperText={state.titleErrors.errorMessage}
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
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                onChange={(e) => dispatch({ type: 'catchListingTypeChange', listingTypeChosen: e.target.value })}
                                onBlur={(e) => dispatch({ type: 'catchListingTypeErrors', listingTypeChosen: e.target.value })}
                                error={state.listingTypeErrors.hasErrors ? true : false}
                                helperText={state.listingTypeErrors.errorMessage}
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
                                onBlur={(e) => dispatch({ type: 'catchPropertyStatusErrors', propertyStatusChosen: e.target.value })}
                                error={state.propertyStatusErrors.hasErrors ? true : false}
                                helperText={state.propertyStatusErrors.errorMessage}
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
                                onBlur={(e) => dispatch({ type: 'catchPriceErrors', priceChosen: e.target.value })}
                                error={state.priceErrors.hasErrors ? true : false}
                                helperText={state.priceErrors.errorMessage}
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

                    <Grid item container justifyContent="space-between">
                        <Grid item xs={5} style={{ marginTop: '1rem' }}>
                            <TextField
                                id="area"
                                label="Area"
                                variant="standard"
                                fullWidth
                                required
                                value={state.areaValue}
                                onChange={(e) => dispatch({ type: 'catchAreaChange', areaChosen: e.target.value })}
                                onBlur={(e) => dispatch({ type: 'catchAreaErrors', areaChosen: e.target.value })}
                                error={state.areaErrors.hasErrors ? true : false}
                                helperText={state.areaErrors.errorMessage}
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {areaOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={5} style={{ marginTop: '1rem' }}>
                            <TextField
                                id="borough"
                                label="Borough"
                                variant="standard"
                                fullWidth
                                required
                                value={state.boroughValue}
                                onChange={(e) => dispatch({ type: 'catchBoroughChange', boroughChosen: e.target.value })}
                                onBlur={(e) => dispatch({ type: 'catchBoroughErrors', boroughChosen: e.target.value })}
                                error={state.boroughErrors.hasErrors ? true : false}
                                helperText={state.boroughErrors.errorMessage}
                                select
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {state.areaValue === 'Inner London' ? innerLondonOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                )) : ""}
                                {state.areaValue === 'Outer London' ? outerLondonOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                )) : ""}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* Map */}

                    <Grid item style={{ marginTop: '1rem' }}>
                        {state.latitudeValue && state.latitudeValue ?
                            <Alert severity='success'>You property is located @ {state.latitudeValue}, {state.latitudeValue}</Alert> :
                            <Alert severity='warning'>Locate your property on the map before submitting this form</Alert>}
                    </Grid>

                    <Grid item container style={{ height: '35rem', marginTop: '1rem' }}>
                        <MapContainer center={[51.505, -0.09]} zoom={14} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <TheMapComponent />
                            {BoroughDisplay()}

                            <Marker
                                draggable
                                eventHandlers={eventHandlers}
                                position={state.markerPosition}
                                ref={markerRef}>
                            </Marker>

                        </MapContainer>
                    </Grid>

                    <Grid item container xs={6} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Button
                            className={classes.picturesBtn}
                            variant='contained'
                            fullWidth
                            required
                            component='label'
                        >UPLOAD PICTURES (MAX 5)
                            <input type='file'
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                hidden
                                onChange={(e) => {
                                    dispatch({ type: 'catchUploadedpictures', picturesChosen: e.target.files })
                                }}
                            />
                        </Button>
                    </Grid>

                    <Grid item container>
                        <ul>
                            {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
                            {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
                            {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
                            {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
                            {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
                        </ul>
                    </Grid>

                    {/* <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="latitude"
                            label="Latitude"
                            variant="standard"
                            required
                            fullWidth
                            value={state.latitudeValue}
                            onChange={(e) => dispatch({ type: 'catchLatitudeChange', latitudeChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="longitude"
                            label="longitude"
                            variant="standard"
                            required
                            fullWidth
                            value={state.longitudeValue}
                            onChange={(e) => dispatch({ type: 'catchLongitudeChange', longitudeChosen: e.target.value })}
                        />
                    </Grid> */}

                    <Grid item container xs={8} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        {submitButtonDisplay()}
                    </Grid>
                </form>
            </div>
            <Snackbar
                open={state.openSnack}
                autoHideDuration={6000}
                message="You have successfully added your property!"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            />
        </>
    );
}

export default AddProperty