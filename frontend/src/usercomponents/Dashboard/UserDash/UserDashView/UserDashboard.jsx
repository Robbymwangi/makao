"use client";
import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Heading } from "@chakra-ui/react";
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";

// Mock function to simulate fetching user data
const fetchUser = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Joel Miller" }), 500)
  );

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then((data) => setUser(data));
  }, []);

  return (
    <VStack spacing={6} align="stretch">
      <Heading
        fontSize="4xl"
        fontWeight="bold"
        paddingBottom={"8"}
        fontFamily={"Playfair display"}
      >
        {user ? `Welcome back, ${user.name}` : "Welcome back"}
      </Heading>

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
    </VStack>
  );
};

export default UserDashboard;