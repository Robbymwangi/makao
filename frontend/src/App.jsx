import React, { useEffect, useState } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { Routes, Route, useLocation, useNavigate } from "react-router";

// Pages
import Landingpage from "./pages/Landingpage.jsx";
import OTPChallengeSend from "./pages/OTPchallengesend.jsx";
import OTPChallengeResp from "./pages/OTPchallengeresp.jsx";
import NotFound from "./pages/404.jsx"; // fallback
import StaffOTPChallengeSend from "./pages/StaffOTPChallengeSend";
import StaffOTPChallengeResp from "./pages/StaffOTPChallengeResp";

// Components
import LandingHeader from "./usercomponents/LandingPageComponents/landingheader.jsx";

// Auth
import Login from "./usercomponents/Auth/UserAuth/Login.jsx";
import SignUp from "./usercomponents/Auth/UserAuth/SignUp.jsx";
import ForgotPassword from "./usercomponents/Auth/UserAuth/ForgotPassword.jsx";
import StaffLogin from "./usercomponents/Auth/StaffAuth/AdminLogin.jsx";
import StaffForgotPassword from "@/usercomponents/Auth/StaffAuth/AdminForgotPassword.jsx";


import DashLayout from "./pages/DashLayout.jsx"; // Dashboard layout

// User Dashboard
import UserDashboard from "./usercomponents/Dashboard/UserDash/UserDashView/UserDashboard.jsx";
import ProjectSelection from "./usercomponents/Dashboard/UserDash/UserDashComponents/ProjectsComponents/ProjectSelect.jsx";
import MyProjects from "./usercomponents/Dashboard/UserDash/UserDashView/MyProjects.jsx";
import Expenses from "./usercomponents/Dashboard/UserDash/UserDashView/Expenses.jsx";
import Reports from "./usercomponents/Dashboard/UserDash/UserDashView/Reports.jsx";
import Messages from "./usercomponents/Dashboard/UserDash/UserDashView/Messages.jsx";
import Support from "./usercomponents/Dashboard/UserDash/UserDashView/Support.jsx";

// Admin Dashboard
import AdminDashboard from "./usercomponents/Dashboard/AdminDash/AdminDashView/AdminDashboard.jsx";
import { useAuthStore } from "./store/useAuthStore.js";

import { supabase } from "@/utils/supabaseClient";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //  Access the login method from Zustand store
  const login =useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(true);

  // Restore Supabase session and login to Zustand
 // Restore Supabase session and login to Zustand
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;

      if (sessionUser) {
        const fullName = sessionUser.user_metadata?.full_name || "User";
        const userRole = sessionUser.user_metadata?.role || "user";
        // Sync Supabase user into Zustand store
        login({ 
          id: sessionUser.id,
          email: sessionUser.email,
          name: fullName,
          role: userRole,

        });
      }

      setLoading(false); // Finish loading state
    };

    restoreSession();
  }, [login]);

  // Restore last route from localStorage
  useEffect(() => {
    const savedRoute = localStorage.getItem("currentRoute");

    const redirectToLastRoute = async () => {
      const { data } = await supabase.auth.getSession();
      const isAuthenticated = !!data?.session?.user;

      if (isAuthenticated && savedRoute && savedRoute !== location.pathname) {
        navigate(savedRoute);
      }
    };

    redirectToLastRoute();
  }, [navigate, location.pathname]);

  // Save current route to localStorage on every change
  useEffect(() => {
    localStorage.setItem("currentRoute", location.pathname);
  }, [location]);

  // Show loading spinner while session is being restored
  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  return (
    <Box>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<><LandingHeader /><Landingpage /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-challengesend" element={<OTPChallengeSend />} />
        <Route path="/otp-challengeresp" element={<OTPChallengeResp />} />

        {/* Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<DashLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="myprojects" element={<ProjectSelection />} />
          <Route path="myprojects/:id" element={<MyProjects />} />
          <Route path="reports" element={<Reports />} />
          <Route path="Expenses" element={<Expenses />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:chatId" element={<Messages />} />
          <Route path="support" element={<Support />} /> {/* <-- Add this line */}
        </Route>

        {/* Staff Routes */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/forgot-password" element={<StaffForgotPassword />} />
        <Route path="/staff/otp-challengesend" element={<StaffOTPChallengeSend />} />
        <Route path="/staff/otp-challengeresp" element={<StaffOTPChallengeResp />} />

        {/* Admin Route */}
        <Route path="/admin-dashboard" element={<DashLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default App;