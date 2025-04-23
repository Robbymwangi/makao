import React from "react";
import { Box, Text, Flex, HStack, VStack, Badge } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { MessageSquare } from "lucide-react";

const AgentReport = () => {
  return (
    <Box p={6} borderWidth="1px" borderRadius="xl" boxShadow="xl" mt={8}>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>Agent's Summary</Text>
      <Flex gap={6} direction={{ base: "column", md: "row" }} align="start">
        <HStack spacing={4} flex={1}>
          <Avatar.Root>
            <Avatar.Fallback name="Agent" />
          </Avatar.Root>
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold">Construction Supervisor</Text>
            <Text fontSize="sm" color="gray.500">Last updated 2 days ago</Text>
          </VStack>
        </HStack>
        <Badge colorPalette="green" alignSelf="start">Good Progress</Badge>
      </Flex>
      <HStack spacing={6} align="start" mt={4}>
        <MessageSquare size={20} />
        <Text>
          Foundation work is progressing well. Ensure proper curing process is maintained for the next 72 hours.
        </Text>
      </HStack>
    </Box>
  );
};

export default AgentReport;