import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// MUI import
import { Typography, AppBar, Toolbar, Button, Menu, MenuItem, Snackbar } from '@mui/material'
import { makeStyles } from "tss-react/mui";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



// context
import StateContext from './Context/StateContext';
import DispatchContext from './Context/DispatchContext';

// import axios
import axios from 'axios';
import urls from './URLS';



const useStyles = makeStyles()(() => ({
    laftNav: {
        margin: 'auto',
    },
    rightNav: {
        margin: 'auto',
        marginRight: '10rem',
    },
    propertyBtn: {
        backgroundColor: 'green',
        color: 'white',
        width: '15rem',
        fontSize: '1.1rem',
        marginRight: '1rem',
        transition: 'all .3s ease-out',
        '&:hover': {
            backgroundColor: '#575fcf',
            color: 'black',
        }
    },
    loginBtn: {
        backgroundColor: 'white',
        color: 'black',
        width: '15rem',
        fontSize: '1.1rem',
        marginRight: '1rem',
        transition: 'all .3s ease-out',
        '&:hover': {
            backgroundColor: '#575fcf',
            color: 'black',
        }
    },
    profileBtn: {
        width: '15rem',
        fontWeight: 'bolder',
        marginBottom: '0.25rem',
        borderRadius: '10px',
        transition: 'all .3s ease-out',
        '&:hover': {
            backgroundColor: '#575fcf',
        }
    },
    logoutBtn: {
        width: '15rem',
        borderRadius: '10px',
        fontWeight: 'bolder',
        marginBottom: '0.25rem',
        transition: 'all .3s ease-out',
        '&:hover': {
            backgroundColor: '#575fcf',
        }
    },
}));




function Header() {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const globalState = useContext(StateContext);
    const globalDispatch = useContext(DispatchContext);


    const [openSnack, setopenSnack] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleProfile = () => {
        setAnchorEl(null);
        navigate('/profile')
    };


    async function HandleLogout() {
        setAnchorEl(null);
        try {
            await axios.post(
                urls.logout,
                globalState.userToken,
                {
                    headers: { Authorization: 'Token '.concat(globalState.userToken) }
                }
            );
            // console.log(response);
            setopenSnack(true);
            globalDispatch({ type: 'logout' });
        } catch (e) {
            console.log(e.response);
        }
    };

    const [confirmDialogopen, setconfirmDialogopen] = useState(false);
    const handleClickOpen = () => {
        setconfirmDialogopen(true);
    };

    const handleCloses = () => {
        setconfirmDialogopen(false);
    };

    useEffect(() => {
        if (openSnack) {
            setTimeout(() => {
                navigate(0);
            }, 1500)
        }
    }, [openSnack]);


    return (
        <AppBar position="static" style={{ backgroundColor: 'black' }}>
            <Toolbar>
                <div className={classes.laftNav}>
                    <Button color="inherit" onClick={() => navigate("/")}>
                        <Typography variant='h4'>
                            LBREP
                        </Typography>
                    </Button>
                </div>
                <div>
                    <Button color="inherit" style={{ marginRight: '2rem' }} onClick={() => navigate("/listings")}>
                        <Typography variant='h6'>
                            Listing
                        </Typography>
                    </Button>
                    <Button
                        onClick={() => navigate("/agencies")}
                        color="inherit"
                        style={{ marginLeft: '2rem' }} >
                        <Typography variant='h6'>
                            Agencies
                        </Typography>
                    </Button>
                </div>
                <div
                    data-aos="fade-right"
                    data-aos-easing="ease"
                    data-aos-delay="400"
                    className={classes.rightNav}
                >
                    <Button
                        className={classes.propertyBtn}
                        onClick={() => navigate('/addproperty')}
                    >
                        Add Property
                    </Button>
                    {globalState.userIsLogged ? (
                        <Button
                            className={classes.loginBtn}
                            onClick={handleClick}
                        >
                            {globalState.userUsername}
                        </Button>) : (
                        <Button className={classes.loginBtn} onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    )
                    }
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem className={classes.profileBtn} onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem className={classes.logoutBtn} onClick={handleClickOpen}>Logout</MenuItem>
                    </Menu>
                    <Dialog
                        open={confirmDialogopen}
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>
                            {"Confirmation Logout?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Are you sure want to leave?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleCloses}>
                                Disagree
                            </Button>
                            <Button onClick={HandleLogout} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={openSnack}
                        autoHideDuration={6000}
                        message="You have successfully logged out!"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                    />
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header