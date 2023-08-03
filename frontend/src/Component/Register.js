import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Button, TextField, Snackbar } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

//url import
import urls from './URLS';




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
    }
}));


function Register() {
    const { classes } = useStyle();
    const usenavigate = useNavigate();



    const initialstate = {
        usernameValue: '',
        emailValue: '',
        passwordValue: '',
        password2Value: '',
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false,
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                break;
            case 'catchEmailChange':
                draft.emailValue = action.emailChosen;
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                break;
            case 'catchPassword2Change':
                draft.password2Value = action.password2Chosen;
                break;
            case 'changeRequest':
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


    function fromSubmit(e) {
        e.preventDefault();
        console.log('The From is submit.');
        dispatch({ type: 'changeRequest' })
        dispatch({ type: 'disabledTheBtn' })
    }


    useEffect(() => {
        if (state.sendRequest) {
            const source = axios.CancelToken.source();
            async function SignUp() {
                try {
                    await axios.post(
                        urls.creat_user,
                        {
                            "email": state.emailValue,
                            "username": state.usernameValue,
                            "password": state.passwordValue,
                            "re_password": state.password2Value
                        },
                        { cancelToken: source.token }
                    );
                    dispatch({ type: 'catchOpenSnack' })
                } catch (error) {
                    console.log(error);
                    dispatch({ type: 'allowTheButton' })
                }
            }
            SignUp();
            return () => {
                source.cancel();
            }
        }
    }, [state.sendRequest])


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
                        <Typography variant='h4'>CREATE AN ACCOUNT</Typography>
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={state.usernameValue}
                            onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={state.emailValue}
                            onChange={(e) => dispatch({ type: 'catchEmailChange', emailChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type='password'
                            fullWidth
                            value={state.passwordValue}
                            onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="password2"
                            label="Confirm Password"
                            variant="outlined"
                            type='password'
                            fullWidth
                            value={state.password2Value}
                            onChange={(e) => dispatch({ type: 'catchPassword2Change', password2Chosen: e.target.value })}
                        />
                    </Grid>
                    <Grid item container xs={8} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Button disabled={state.disabledBtn} className={classes.registerBtn} variant='contained' fullWidth type='submit'>SIGN UP</Button>
                    </Grid>
                </form>
                <Grid item container justifyContent="center" style={{ marginTop: '1rem' }}>
                    <Typography variant='small'>Already have an account? <span onClick={() => usenavigate('/login')} style={{ cursor: 'pointer', color: 'green' }}>SIGN IN</span></Typography>
                </Grid>
            </div>
            <Snackbar
                open={state.openSnack}
                autoHideDuration={6000}
                message="You have successfully create an account!"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            />
        </>
    );
}

export default Register;