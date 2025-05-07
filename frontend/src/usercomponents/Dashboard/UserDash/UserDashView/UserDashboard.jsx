"use client";
import React from "react";
import DashLayout from "@/pages/DashLayout";
import { Home, ClipboardList, BarChart, Building, MessageCircle, Settings } from "lucide-react";
import { VStack, HStack, Flex, Text } from "@chakra-ui/react";

import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";
import MyProjects from "@/usercomponents/Dashboard/UserDash/UserDashView/MyProjects";

const UserDashboard = () => {
  const menuItems = [
    { label: "Home", icon: Home },
    { label: "Expenses", icon: Building },
    { label: "Progress", icon: ClipboardList },
    { label: "Reports", icon: BarChart },
    { label: "My Projects", icon: Building }, 
    { label: "Messages", icon: MessageCircle },
    { label: "Support", icon: Settings },
    
  ];

  const renderContent = (selectedMenu) => {
    switch (selectedMenu) {
      case "Home":
        return (
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
        );
      case "My Projects":
        return <MyProjects />; // Render MyProjects component
      case "Reports":
        return <div>Reports Content</div>;
      case "Expenses":
        return <div>Expenses Content</div>;
      case "Messages":
        return <div>Messages Content</div>;
      case "Support":
        return <div>Support Content</div>;
      default:
        return <div>Select a menu item to view content.</div>;
    }
  };

  return (
    <DashLayout
      userName="Robby"
      menuItems={menuItems}
      defaultContent={
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
      }
      renderContent={(selectedMenu) => (
        <>
          {selectedMenu === "Home" && (
            <Flex justify="space-between" align="center" mb={6} gap={4} wrap="wrap">
              <VStack align="start" spacing={1} flex="1" minW="0">
                <Text fontSize={{ base: "md", md: "xl" }} color="gray.600" isTruncated>
                  Welcome back, Robby!
                </Text>
                <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" isTruncated>
                  Dashboard Overview
                </Text>
              </VStack>
            </Flex>
          )}
          {renderContent(selectedMenu)}
        </>
      )}
    />
  );
};

export default UserDashboard;