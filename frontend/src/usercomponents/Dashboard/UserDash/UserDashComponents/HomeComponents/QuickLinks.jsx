import React from "react";
import { Box, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import { Link2, Plus } from "lucide-react";

const QuickLinks = () => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm" mt={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">Quick Links</Text>
        <Flex as="button" align="center" gap={2} px={4} py={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
          <Plus size={16} />
          <Text>Add Link</Text>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Flex
            key={i}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            align="center"
            gap={4}
            _hover={{ bg: "gray.50" }}
            boxShadow="lg"
          >
            <Link2 size={20} />
            <Text>Document {i}</Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default QuickLinks;