import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import React, {useEffect} from 'react';
//MUI import
import { StyledEngineProvider } from '@mui/material';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
//Components
import Header from './Component/Header';
import Home from './Component/Home';
import Login from './Component/Login';
import Listings from './Component/Listings';
import ListingDetail from './Component/ListingDetail';
import Register from './Component/Register';
import AddProperty from './Component/AddProperty';
import Profile from './Component/Profile';
import Agencies from './Component/Agencies';
import AgencyDetail from './Component/AgencyDetail';



import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles


// context
import DispatchContext from './Component/Context/DispatchContext';
import StateContext from './Component/Context/StateContext';


function App() {


  const initialstate = {
    userUsername: localStorage.getItem("theUserUsername"),
    userEmail: localStorage.getItem("theUserEmail"),
    userId: localStorage.getItem("theUserId"),
    userToken: localStorage.getItem("theUserToken"),
    userIsLogged: localStorage.getItem("theUserUsername") ? true : false,
  };

  function ReduceFunction(draft, action) {
    switch (action.type) {
      case 'catchToken':
        draft.userToken = action.tokenValue;
        break;
      case 'userSignsIn':
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.idInfo;
        draft.userIsLogged = true;
        break;
        case 'logout':
        draft.userIsLogged = false;
        break;
      default:
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ReduceFunction, initialstate);

  useEffect(() => {
    if(state.userIsLogged){
      localStorage.setItem('theUserUsername', state.userUsername)
      localStorage.setItem('theUserEmail', state.userEmail)
      localStorage.setItem('theUserId', state.userId)
      localStorage.setItem('theUserToken', state.userToken)
    }else{
      localStorage.removeItem('theUserUsername')
      localStorage.removeItem('theUserEmail')
      localStorage.removeItem('theUserId')
      localStorage.removeItem('theUserToken')
    }
  }, [state.userIsLogged])


  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <ScopedCssBaseline />
            <Header />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/listings' element={<Listings />} />
              <Route path='/listings/:id' element={<ListingDetail />} />
              <Route path='/addproperty' element={<AddProperty />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/agencies' element={<Agencies />} />
              <Route path='/agencies/:id' element={<AgencyDetail />} />
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;


AOS.init();