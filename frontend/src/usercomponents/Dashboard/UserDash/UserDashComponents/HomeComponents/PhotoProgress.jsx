import React from "react";
import { Box, Text, HStack, Flex } from "@chakra-ui/react";
import { Image, Plus } from "lucide-react";

const PhotoProgress = () => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="xl" boxShadow="sm" mt={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">Photo Progress</Text>
        <Flex as="button" align="center" gap={2} px={4} py={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
          <Plus size={16} />
          <Text>See All Reports</Text>
        </Flex>
      </Flex>
      <HStack spacing={6} overflowX="auto" pb={2}>
        {["3 weeks ago", "2 months ago", "3 months ago"].map((label) => (
          <Box
            key={label}
            minW="240px"
            borderWidth="1px"
            borderRadius="xl"
            p={4}
            flexShrink={0}
            boxShadow="xl"
          >
            <Box bg="gray.100" h="160px" borderRadius="md" mb={4} />
            <HStack spacing={2}>
              <Image size={16} />
              <Text fontSize="sm">{label}</Text>
            </HStack>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default PhotoProgress;