import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

// Pages
import Landingpage from "./pages/Landingpage.jsx";
import OTPChallengeSend from "./pages/OTPchallengesend.jsx";
import OTPChallengeResp from "./pages/OTPchallengeresp.jsx";
import NotFound from "./pages/404.jsx"; // fallback

// Components
import LandingHeader from "./usercomponents/LandingPageComponents/landingheader.jsx";

// Auth
import Login from "./usercomponents/Auth/Login.jsx";
import SignUp from "./usercomponents/Auth/SignUp.jsx";
import ForgotPassword from "./usercomponents/Auth/ForgotPassword.jsx";

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<><LandingHeader /><Landingpage /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-challengesend" element={<OTPChallengeSend />} />
        <Route path="/otp-challengeresp" element={<OTPChallengeResp />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;
