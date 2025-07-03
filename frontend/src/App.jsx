import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, useLocation, useNavigate } from "react-router";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/store/useAuthStore";


// Pages
import Landingpage from "./pages/Landingpage.jsx";
import OTPChallengeSend from "./pages/OTPchallengesend.jsx";
import OTPChallengeResp from "./pages/OTPchallengeresp.jsx";
import NotFound from "./pages/404.jsx";
import StaffOTPChallengeSend from "./pages/StaffOTPChallengeSend";
import StaffOTPChallengeResp from "./pages/StaffOTPChallengeResp";
import EmailConfirmation from "./pages/EmailConfirmation.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

// Components
import LandingHeader from "./usercomponents/LandingPageComponents/landingheader.jsx";

// Auth
import Login from "./usercomponents/Auth/UserAuth/Login.jsx";
import SignUp from "./usercomponents/Auth/UserAuth/SignUp.jsx";
import ForgotPassword from "./usercomponents/Auth/UserAuth/ForgotPassword.jsx";
import StaffLogin from "./usercomponents/Auth/StaffAuth/AdminLogin.jsx";
import StaffForgotPassword from "@/usercomponents/Auth/StaffAuth/AdminForgotPassword.jsx";

import DashLayout from "./pages/DashLayout.jsx";

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
// Agent Admin Views
import AgentAssignedClients from "./usercomponents/Dashboard/AdminDash/AdminDashView/AgentItems/AssignedClients";
import AgentTimelineView from "./usercomponents/Dashboard/AdminDash/AdminDashView/AgentItems/TimelineView";
import AgentMyProjects from "./usercomponents/Dashboard/AdminDash/AdminDashView/AgentItems/MyProjects";
import AgentMessages from "./usercomponents/Dashboard/AdminDash/AdminDashView/AgentItems/Messages";
// Consultant Admin Views
import ConsultantProjectTimelines from "./usercomponents/Dashboard/AdminDash/AdminDashView/ConsultantItems/ProjectTimelines";
import ConsultantSubmitDeliverables from "./usercomponents/Dashboard/AdminDash/AdminDashView/ConsultantItems/SubmitDeliverables";
import ConsultantMessages from "./usercomponents/Dashboard/AdminDash/AdminDashView/ConsultantItems/Messages";
// SysAdmin Views
import UserManagement from "./usercomponents/Dashboard/AdminDash/AdminDashView/SysAdminItems/UserManagement";
import StaffManagement from "./usercomponents/Dashboard/AdminDash/AdminDashView/SysAdminItems/StaffManagement";
import SupportTools from "./usercomponents/Dashboard/AdminDash/AdminDashView/SysAdminItems/SupportTools";
import SysAdminMessages from "./usercomponents/Dashboard/AdminDash/AdminDashView/SysAdminItems/Messages";
import ProjectApprovals from "./usercomponents/Dashboard/AdminDash/AdminDashView/SysAdminItems/ProjectApprovals";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initializeSession, isAuthenticated } = useAuthStore();

  // Initialize session once on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeSession();
      } catch (error) {
        console.error("Session init failed:", error);
      }
    };
    init();
  }, [initializeSession]);

  // Save current route to localStorage on route change
  useEffect(() => {
    localStorage.setItem("currentRoute", location.pathname);
  }, [location]);

  // Restore last known route after session restoration
  useEffect(() => {
    const savedRoute = localStorage.getItem("currentRoute");
    const isAuthRoute = ["/login", "/signup", "/forgot-password", "/auth/confirm", "/verify-email"];

    if (
      isAuthenticated &&
      savedRoute &&
      savedRoute !== location.pathname &&
      !isAuthRoute.includes(savedRoute)
    ) {
      navigate(savedRoute, { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <Box>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><LandingHeader /><Landingpage /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/confirm" element={<EmailConfirmation />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/otp-challengesend" element={<OTPChallengeSend />} />
        <Route path="/otp-challengeresp" element={<OTPChallengeResp />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<DashLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="myprojects" element={<ProjectSelection />} />
          <Route path="myprojects/:id" element={<MyProjects />} />
          <Route path="reports" element={<Reports />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:chatId" element={<Messages />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/forgot-password" element={<StaffForgotPassword />} />
        <Route path="/staff/otp-challengesend" element={<StaffOTPChallengeSend />} />
        <Route path="/staff/otp-challengeresp" element={<StaffOTPChallengeResp />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<DashLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Agent Admin Routes */}
          <Route path="clients" element={<AgentAssignedClients />} />
          <Route path="timeline" element={<AgentTimelineView />} />
          <Route path="projects" element={<AgentMyProjects />} />
          <Route path="projects/:id" element={<AgentMyProjects />} />
          <Route path="messages" element={<AgentMessages />} />
          {/* Consultant Admin Routes */}
          <Route path="consultant-projects" element={<ConsultantProjectTimelines />} />
          <Route path="deliverables" element={<ConsultantSubmitDeliverables />} />
          <Route path="consultant-messages" element={<ConsultantMessages />} />
          {/* SysAdmin Routes */}
          <Route path="user-management" element={<UserManagement />} />
          <Route path="users" element={<UserManagement />} />
         <Route path="staff" element={<StaffManagement />} />
          <Route path="support" element={<SupportTools />} />
          <Route path="sysadmin-messages" element={<SysAdminMessages />} />
          <Route path="project-approvals" element={<ProjectApprovals />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default App;
