import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

// MUI import
import { Typography, AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material'
import { makeStyles } from "tss-react/mui";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Header() {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const globalState = useContext(StateContext);
    const globalDispatch = useContext(DispatchContext);

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
            globalDispatch({ type: 'logout' });
            navigate('/');

        } catch (e) {
            console.log(e.response);
        }
    };

    const [dialogopen, setDialogOpens] = React.useState(false);
    const handleClickOpen = () => {
        setDialogOpens(true);
    };

    const handleCloses = () => {
        setDialogOpens(false);
    };

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
                    <Button color="inherit" style={{ marginRight: '2rem' }} onClick={() => navigate("/losting")}>
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
                        <Dialog
                            open={dialogopen}
                            TransitionComponent={Transition}
                            keepMounted
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
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header