import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";

const ConsultantAdminHome = () => (
  <VStack spacing={6} align="stretch">
    <Heading fontSize="3xl">Consultant Admin Home</Heading>
    <Text>Welcome, Consultant Admin! Here you can manage projects, deliverables, and messages.</Text>
    {/* Add more consultant admin-specific widgets here */}
  </VStack>
);

export default ConsultantAdminHome;
