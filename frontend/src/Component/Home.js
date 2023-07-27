import React from 'react'
//MUI Import
import { Typography } from '@mui/material'
import { makeStyles } from "tss-react/mui";
//Assets
import city from './Assets/city.jpg';






const useStyles = makeStyles()(() => ({
  propertyBtn: {
    backgroundColor: 'green',
    color: 'white',
    width: '15rem',
    fontSize: '1.1rem',
    marginRight: '1rem',
    transition: 'all .3s ease-in-out',
    '&:hover': {
      backgroundColor: 'white',
      color: 'green',
      boxShadow: '#dcdde1 0px 5px 5px',
    }
  },
  loginBtn: {
    backgroundColor: 'white',
    color: 'green',
    width: '15rem',
    fontSize: '1.1rem',
    marginLeft: '1rem',
    transition: 'all .3s ease-in-out',
    '&:hover': {
      backgroundColor: 'green',
      color: 'white',
      boxShadow: '#44bd32 0px 5px 5px',
    }
  },
  cityImg: {
    width: '100%',
    height: "92vh"
  },
  overlayText: {
    position: 'absolute',
    zIndex: '100',
    top: '100px',
    left: "20px",
    textAlign: 'center'
  },
  homeText: {
    color: "white",
    fontWeight: 'bolder',
  },
  homeBtn: {
    fontSize: '3.5rem',
    fontWeight: 'bolder',
    borderRadius: '15px',
    color: 'white',
    backgroundColor: 'green',
    marginTop: '2rem',
    boxShadow: '3px 3px 3px white',
    padding: '15px',
  }
}));


function Home() {
  const { classes } = useStyles();
  return (
    <>
      <div style={{ position: 'relative' }}>
        <input
         type="image" 
         img="true" 
         src={city} 
         alt="home Page city image." 
         className={classes.cityImg} 
         data-aos="zoom-in" 
         data-aos-easing="ease" 
         />
        <div className={classes.overlayText}>
          <Typography data-aos="zoom-in" variant='h1' className={classes.homeText}>FIND YOUR <span style={{ color: 'green' }}>NEXT PROPERTY</span> ON THE LBREP WEBSITE</Typography>
          <button data-aos="fade-up" data-aos-easing="ease" data-aos-delay="400" variant='contained' className={classes.homeBtn}>SEE ALL PROPERTIES</button>
        </div>
      </div>
    </>
  )
}

export default Home;