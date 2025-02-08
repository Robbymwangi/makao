import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

import Landingpage from './pages/Landingpage.jsx';
import LandingHeader from './usercomponents/landingheader.jsx';


function App () {
  return (
    <Box>    
      <LandingHeader />

      <Routes>
        <Route path='/' element={<Landingpage />} />
      </Routes>
    </Box>
  );
  
}


export default App;

