import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//immer
import { useImmerReducer } from 'use-immer';

//MUI 
import { Grid, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
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
        usernameError: {
            hasErrors: false,
            errorMessage: '',
        },
        emailErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        passwordErrors: {
            hasErrors: false,
            errorMessage: '',
        },
        password2HelperText: '',
        serverMessageUsername: '',
        serverMessageEmail: '',
        serverMessagePassword: '',
    };

    function ReduceFunction(draft, action) {
        switch (action.type) {
            case 'catchUsernameChange':
                draft.usernameValue = action.usernameChosen;
                draft.usernameError.hasErrors = false;
                draft.usernameError.errorMessage = "";
                draft.serverMessageUsername = '';
                break;
            case 'catchEmailChange':
                draft.emailValue = action.emailChosen;
                draft.emailErrors.hasErrors = false;
                draft.emailErrors.errorMessage = "";
                draft.serverMessageEmail = '';
                break;
            case 'catchPasswordChange':
                draft.passwordValue = action.passwordChosen;
                draft.passwordErrors.hasErrors = false;
                draft.passwordErrors.errorMessage = "";
                draft.serverMessagePassword = '';
                break;
            case 'catchPassword2Change':
                draft.password2Value = action.password2Chosen;
                if (action.password2Chosen !== draft.passwordValue) {
                    draft.password2HelperText = 'The password must match';
                } else if (action.password2Chosen === draft.passwordValue) {
                    draft.password2HelperText = '';
                }
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
            case 'catchUsernameErrors':
                if (action.usernameChosen.length === 0) {
                    draft.usernameError.hasErrors = true;
                    draft.usernameError.errorMessage = "This field must not be empty";
                }
                else if (action.usernameChosen.length < 5) {
                    draft.usernameError.hasErrors = true;
                    draft.usernameError.errorMessage = "The usename must have at least five characters";
                }
                else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
                    draft.usernameError.hasErrors = true;
                    draft.usernameError.errorMessage = "This field must not have sperial characters";
                }
                break;
            case 'catchEmailErrors':
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(action.emailChosen)) {
                    draft.emailErrors.hasErrors = true;
                    draft.emailErrors.errorMessage = "Please enter a valid email!";
                }
                break;
            case 'catchPasswordErrors':
                if (action.passwordChosen.length < 8) {
                    draft.passwordErrors.hasErrors = true;
                    draft.passwordErrors.errorMessage = "The password must at least have 8 characters!";
                }
                break;
            case 'usernameExists':
                draft.usernameError.hasErrors = true;
                draft.serverMessageUsername = 'This username already exists!';

                break;
            case 'emailExists':
                draft.serverMessageEmail = 'This email already exists!';
                draft.emailErrors.hasErrors = true;
                break;
            case 'passwordError':
                draft.serverMessagePassword = action.passwordErrorMessage;
                draft.passwordErrors.hasErrors = true;
                break;
            default:
                break;
        }
    };

    const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);


    function fromSubmit(e) {
        e.preventDefault();
        if (!state.usernameError.hasErrors &&
            !state.emailErrors.hasErrors &&
            !state.passwordErrors.hasErrors &&
            state.password2HelperText === '') {
            dispatch({ type: 'disabledTheBtn' })
            dispatch({ type: 'changeRequest' })
        }
    }


    useEffect(() => {
        if (state.sendRequest) {
            const source = axios.CancelToken.source();
            async function SignUp() {
                try {
                    const response = await axios.post(
                        urls.creat_user,
                        {
                            "email": state.emailValue,
                            "username": state.usernameValue,
                            "password": state.passwordValue,
                            "re_password": state.password2Value
                        },
                        { cancelToken: source.token }
                    );
                    console.log(response.data);
                    dispatch({ type: 'catchOpenSnack' })
                } catch (error) {
                    console.log(error.response);
                    dispatch({ type: 'allowTheButton' })
                    if(error.response.data.username){
                        dispatch({ type: 'usernameExists' })
                    }
                    if(error.response.data.email){
                        dispatch({ type: 'emailExists' })
                    }
                    if(error.response.data.password){
                        dispatch({ type: 'passwordError', passwordErrorMessage: error.response.data.password[0]  })
                    }
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


                    {state.serverMessageUsername ? (<Alert severity="error" style={{marginBottom: '.5rem'}} >{state.serverMessageUsername }</Alert>) : ""}
                    {state.serverMessageEmail ? (<Alert severity="error" style={{marginBottom: '.5rem'}} >{state.serverMessageEmail }</Alert>) : ""}
                    {state.serverMessagePassword ? (<Alert severity="error" style={{marginBottom: '.5rem'}} >{state.serverMessagePassword }</Alert>) : ""}

                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            required
                            fullWidth
                            value={state.usernameValue}
                            onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
                            onBlur={(e) => dispatch({ type: 'catchUsernameErrors', usernameChosen: e.target.value })}
                            error={state.usernameError.hasErrors ? true : false}
                            helperText={state.usernameError.errorMessage}
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            required
                            fullWidth
                            value={state.emailValue}
                            onChange={(e) => dispatch({ type: 'catchEmailChange', emailChosen: e.target.value })}
                            onBlur={(e) => dispatch({ type: 'catchEmailErrors', emailChosen: e.target.value })}
                            error={state.emailErrors.hasErrors ? true : false}
                            helperText={state.emailErrors.errorMessage}
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
                            onBlur={(e) => dispatch({ type: 'catchPasswordErrors', passwordChosen: e.target.value })}
                            error={state.passwordErrors.hasErrors ? true : false}
                            helperText={state.passwordErrors.errorMessage}
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
                            onFocus={(e) => dispatch({ type: 'catchPassword2Change', password2Chosen: e.target.value })}
                            helperText={state.password2HelperText}
                            error={state.password2HelperText === '' ? false : true}
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