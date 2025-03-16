import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router";
import Landingpage from './pages/Landingpage.jsx';
import LandingHeader from './usercomponents/LandingPageComponents/landingheader.jsx';
import Login from "./usercomponents/Auth/Login.jsx";
import SignUp from "./usercomponents/Auth/SignUp.jsx";
import ForgotPassword from "./usercomponents/Auth/ForgotPassword.jsx";


function App () {
  return (
    <Box>    
      <Routes>
        <Route path='/' element={<><LandingHeader /><Landingpage /></>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </Box>
  );
  
}


export default App;

