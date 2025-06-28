import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";

const SystemAdminHome = () => (
  <VStack spacing={6} align="stretch">
    <Heading fontSize="3xl">System Admin Home</Heading>
    <Text>Welcome, System Administrator! Here you can manage users, staff, and support tools.</Text>
    {/* Add more system admin-specific widgets here */}
  </VStack>
);

export default SystemAdminHome;
