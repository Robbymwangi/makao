"use client";
import React, { useEffect, useState, useRef } from "react";
import { VStack, HStack, Heading, useBreakpointValue } from "@chakra-ui/react";
import { CSSTransition } from "react-transition-group";
import { useAuthStore } from "@/store/useAuthStore";
import { getMenuByRole } from "@/utils/menuUtils";
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";

const fetchUser = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Joel Miller" }), 1500)
  );

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [showName, setShowName] = useState(false);
  const headingRef = useRef(null);
  const role = useAuthStore((state) => state.role);
  const menuItems = getMenuByRole(role);

  useEffect(() => {
    fetchUser().then((data) => {
      setUser(data);
      setShowName(true);
    });
  }, []);

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
            paddingBottom={"8"}
            fontFamily={"Playfair display"}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
          >
            {user ? `Welcome back, ${user.name}` : "Welcome back"}
          </Heading>
        </CSSTransition>

        {/* Other Dashboard Components */}
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