"use client";
import React from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";

const Expenses = () => {
  return (
    <VStack spacing={4} align="stretch" p={{ base: 4, md: 6 }} minH="50vh">
      {/* Page Title */}
      <Heading size="2xl" mb={6} color="gray.700" textAlign="left" fontWeight="bold" >
        Expenses Dashboard
      </Heading>

      {/* Content Section */}
      <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
        {/* Add your content here */}
      </Box>
    </VStack>
  );
};

export default Expenses;