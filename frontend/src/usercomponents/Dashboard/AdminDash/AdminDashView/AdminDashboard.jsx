"use client";
import React from "react";
import { VStack, Text, Heading } from "@chakra-ui/react";
import { useAuthStore } from "@/store/useAuthStore"; // Import the store
import SystemAdminHome from "./SysAdminItems/SystemAdminHome";
import ConsultantAdminHome from "./ConsultantItems/ConsultantAdminHome";
import AgentAdminHome from "./AgentItems/AgentAdminHome";

const AdminDashboard = () => {
  // Get the role directly from the Zustand store
  const role = useAuthStore((state) => state.role);

  if (role === "systemAdmin") {
    return <SystemAdminHome />;
  } else if (role === "consultantAdmin") {
    return <ConsultantAdminHome />;
  } else if (role === "agentAdmin") {
    return <AgentAdminHome />;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading fontSize="4xl" fontWeight="bold">Admin Dashboard</Heading>
      <Text fontSize="xl">You are logged in as: <strong>{role}</strong></Text>
      {/* Add other admin dashboard components here */}
    </VStack>
  );
};

export default AdminDashboard;