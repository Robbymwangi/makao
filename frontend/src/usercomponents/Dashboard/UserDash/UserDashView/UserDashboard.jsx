"use client";
import React, { useEffect, useState, useRef } from "react";
import { VStack, HStack, Text, Heading, useBreakpointValue } from "@chakra-ui/react";
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";
import { CSSTransition } from "react-transition-group";
import { getMenuByRole } from "@/utils/menuUtils";

// Mock function to simulate fetching user data
const fetchUser = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Joel Miller" }), 1500)
  );

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [showName, setShowName] = useState(false);
  const headingRef = useRef(null); // Create a ref for the heading
  const menuItems = getMenuByRole("user");

  useEffect(() => {
    fetchUser().then((data) => {
      setUser(data);
      setShowName(true); // Trigger the fade-in effect
    });
  }, []);

  return (
    <>
      <style>
        {`
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
        `}
      </style>
      <VStack spacing={6} align="stretch">
        <CSSTransition
          in={showName}
          timeout={500} // Duration of the fade-in effect
          classNames="fade"
          unmountOnExit
          nodeRef={headingRef} // Pass the ref to CSSTransition
        >
          <Heading
            ref={headingRef} // Attach the ref to the element
            fontSize="4xl"
            fontWeight="bold"
            paddingBottom={"8"}
            fontFamily={"Playfair display"}
            textAlign={useBreakpointValue({ base: "center", md: "left" })} // Center on smaller screens
          >
            {user ? `Welcome back, ${user.name}` : "Welcome back"}
          </Heading>
        </CSSTransition>

        <VStack spacing={{ base: 8, md: 12 }} align="fill">
          {/* Stats Cards */}
          <StatsCards />

          {/* Timeline and Financial Health Side by Side */}
          <HStack
            spacing={8}
            align="start"
            divideX="1px"
            divideColor="gray.200"
            flexWrap={{ base: "wrap", md: "nowrap" }}
            mt={8}
          >
            {/* Financial Health */}
            <FinancialOverview />

            {/* Timeline */}
            <ProjectTimeline />
          </HStack>

          {/* Photo Progress */}
          <PhotoProgress />

          {/* Quick Links */}
          <QuickLinks />

          {/* Agent Report */}
          <AgentReport />
        </VStack>

        <HStack spacing={6}>
          {menuItems.map((item) => (
            <Text
              key={item.label}
              fontSize="lg"
              fontWeight="bold"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              {item.label}
            </Text>
          ))}
        </HStack>
      </VStack>
    </>
  );
};

export default UserDashboard;