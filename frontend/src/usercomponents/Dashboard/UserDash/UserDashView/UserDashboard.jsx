"use client";
import React, { useEffect, useState, useRef } from "react";
import { VStack, HStack, Heading, useBreakpointValue } from "@chakra-ui/react";
import { CSSTransition } from "react-transition-group";
import { useAuthStore } from "@/store/useAuthStore";
import { getMenuByRole } from "@/utils/menuUtils";
import supabase from "@/utils/supabaseClient";

// Dashboard Components
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";

const UserDashboard = () => {
  const headingRef = useRef(null);
  // State to control the visibility of the welcome message
  const [showName, setShowName] = useState(false);

  // Zustand store to manage user authentication state
  // This will automatically fetch the user and role from the store
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    // This ensures that the user data is available when the component mounts
    if (user) {
      setShowName(true);
    }
  }, [user]);       

  const menuItems = getMenuByRole(role);
  const welcomeName= user?.name || "User";
  // Show the welcome message after the user is fetched

  return (
    <>
      <style>{`
        .fade-enter {
          opacity: 0;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 1000ms ease-in;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 1500ms ease-out;
        }
      `}</style>

      <VStack spacing={6} align="stretch">
        <CSSTransition
          in={showName}
          timeout={500}
          classNames="fade"
          unmountOnExit
          nodeRef={headingRef}
        >
          <Heading
            ref={headingRef}
            fontSize="4xl"
            fontWeight="bold"
            paddingBottom="8"
            fontFamily="Playfair Display"
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
          >
            {user ? `Welcome back, ${welcomeName}` : "Welcome to your Dashboard!"}
          </Heading>
        </CSSTransition>

        <StatsCards />
        <HStack spacing={8} align="start" mt={8}>
          <FinancialOverview />
          <ProjectTimeline />
        </HStack>
        <PhotoProgress />
        <QuickLinks />
        <AgentReport />
      </VStack>
    </>
  );
};

export default UserDashboard;

