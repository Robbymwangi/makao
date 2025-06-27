import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/useAuthStore";

const AdminDashboard = () => {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";

  const getDashboardTitle = () => {
    switch (role) {
      case "systemAdmin":
        return "System Admin Dashboard";
      case "consultantAdmin":
        return "Consultant Admin Dashboard";
      case "agentAdmin":
        return "Agent Admin Dashboard";
      default:
        return "Admin Dashboard";
    }
  };

  return (
    <VStack spacing={6} align="stretch" px={4} py={6}>
      <Heading fontSize="3xl" fontWeight="bold">
        {getDashboardTitle()}
      </Heading>

      <Text fontSize="lg">
        Welcome back, <strong>{displayName}</strong>. You are logged in as: <strong>{role}</strong>
      </Text>
    </VStack>
  );
};

export default AdminDashboard;
