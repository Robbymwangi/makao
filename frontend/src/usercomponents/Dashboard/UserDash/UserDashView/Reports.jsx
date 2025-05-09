import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Expenses = () => {
  return (
    <VStack spacing={8} align="stretch" p={4}>
      <Heading size="2xl">Expenses</Heading>
      <Text color="gray.600">This is the expenses page. Add your implementation here.</Text>
      <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
        {/* Expenses content goes here */}
      </Box>
    </VStack>
  );
};

export default Expenses;