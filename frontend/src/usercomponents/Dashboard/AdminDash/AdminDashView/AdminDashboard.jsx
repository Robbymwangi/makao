import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/useAuthStore";

const AdminDashboard = () => {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  return (
    <VStack spacing={6} align="stretch" px={4} py={6}>
      <Heading fontSize="4xl" fontWeight="bold">
        System Admin Dashboard
      </Heading>

      <Text fontSize="lg">
        Welcome back, <strong>{user?.name || "Admin"}</strong>. You are logged in as: <strong>{role}</strong>
      </Text>

      {/* Dashboard Overview Content */}
      <Heading fontSize="2xl" mt={4}>Dashboard Overview</Heading>
      <Text>Metrics, charts, and summaries will go here.</Text>

      {/* User Management Section */}
      <Heading fontSize="2xl" mt={8}>User Management</Heading>
      <Text>User Management Section</Text>

      {/* Staff Management Section */}
      <Heading fontSize="2xl" mt={8}>Staff Management</Heading>
      <Text>Staff Management Section</Text>
    </VStack>
  );
};

export default AdminDashboard;
