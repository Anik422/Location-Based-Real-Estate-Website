import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import { makeStyles } from 'tss-react/mui';


//url import
import urls from './URLS';

//context
import DispatchContext from './Context/DispatchContext';



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
    }
}));


function Login() {
    const { classes } = useStyle();
    const usenavigate = useNavigate();
    const GlobalDispatch = useContext(DispatchContext);


    const initialstate = {
        usernameValue: '',
        passwordValue: '',
        sendRequest: 0,
        token: '',
        openSnack: false,
        disabledBtn: false,
        serverError: false,
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                draft.serverError = false;
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                draft.serverError = false;
                break;
            case 'changeRequest':
                draft.sendRequest = draft.sendRequest + 1;
                break;
            case 'catchToken':
                draft.token = action.tokenValue;
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
            case 'catchServerError':
                draft.serverError = true;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);

    function fromSubmit(e) {
        e.preventDefault();
        dispatch({ type: 'changeRequest' })
        dispatch({ type: 'disabledTheBtn' })
    }


    //user login 
    useEffect(() => {
        if (state.sendRequest) {
            const source = axios.CancelToken.source();
            async function SignIn() {
                try {
                    const response = await axios.post(
                        urls.login,
                        {
                            "username": state.usernameValue,
                            "password": state.passwordValue,
                        },
                        { cancelToken: source.token }
                    );
                    dispatch({ type: 'catchToken', tokenValue: response.data.auth_token })
                    GlobalDispatch({ type: 'catchToken', tokenValue: response.data.auth_token })
                } catch (error) {
                    dispatch({ type: 'allowTheButton' })
                    dispatch({ type: 'catchServerError' })
                    console.log(error);
                }
            }
            SignIn();
            return () => {
                source.cancel();
            }
        }
    }, [state.sendRequest])


    //Get user info
    useEffect(() => {
        if (state.token !== '') {
            const source = axios.CancelToken.source();
            async function GetUserInfo() {
                try {
                    const response = await axios.get(
                        urls.user_info,
                        {
                            headers: { Authorization: 'Token '.concat(state.token) }
                        },
                        { cancelToken: source.token }
                    );
                    GlobalDispatch({
                        type: 'userSignsIn',
                        usernameInfo: response.data.username,
                        emailInfo: response.data.email,
                        idInfo: response.data.id
                    });
                    dispatch({ type: 'catchOpenSnack' })
                } catch (error) {
                    console.log(error);
                }
            }
            GetUserInfo();
            return () => {
                source.cancel();
            }
        }
    }, [state.token])

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                usenavigate("/");
            }, 1500)
        }
    }, [state.openSnack]);


    return (
        <>
            <div className={classes.fromContainer} data-aos="zoom-in-up">
                <form onSubmit={fromSubmit}>
                    <Grid item container justifyContent="center">
                        <Typography variant='h4'>SIGN IN</Typography>
                    </Grid>

                    {state.serverError ? (<Alert severity="error" >Incorrect username or password!</Alert>) : ""}


                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            required
                            value={state.usernameValue}
                            onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
                            error = {state.serverError ? true : false}
                            />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type='password'
                            required
                            fullWidth
                            value={state.passwordValue}
                            onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })}
                            error = {state.serverError ? true : false}
                        />
                    </Grid>
                    <Grid item container xs={8} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Button className={classes.loginBtn} disabled={state.disabledBtn} variant='contained' fullWidth type='submit'>SIGN IN</Button>
                    </Grid>
                </form>
                <Grid item container justifyContent="center" style={{ marginTop: '1rem' }}>
                    <Typography variant='small'>Don't have an account yet? <span onClick={() => usenavigate('/register')} style={{ cursor: 'pointer', color: 'green' }}>SIGN UP</span></Typography>
                </Grid>
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

export default Login;