"use client";
import React from "react";
import { VStack, HStack } from "@chakra-ui/react";
import DashLayout from "@/pages/DashLayout";

// Import components from UserDashComponents
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/AgentReport";

const UserDashboard = () => {
  return (
    <DashLayout userName="Robby">
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
    </DashLayout>
  );
};

export default UserDashboard;