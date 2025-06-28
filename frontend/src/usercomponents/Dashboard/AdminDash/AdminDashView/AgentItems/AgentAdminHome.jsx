import React from "react";
import {
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Box,
  Button,
  Icon,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { Home, Users, UploadCloud, CalendarPlus } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard Overview",
    description: "View your dashboard summary and key metrics.",
    icon: Home,
    action: () => {},
    color: "blue.500",
  },
  {
    label: "Assigned Clients",
    description: "See and manage your assigned clients.",
    icon: Users,
    action: () => {},
    color: "green.500",
  },
  {
    label: "Upload Documents",
    description: "Upload relevant documents for your clients or projects.",
    icon: UploadCloud,
    action: () => {},
    color: "purple.500",
  },
  {
    label: "Add to Calendar",
    description: "Add important items or events to your calendar.",
    icon: CalendarPlus,
    action: () => {},
    color: "orange.500",
  },
];

const AgentAdminHome = () => {
  return (
    <VStack spacing={8} align="stretch" w="100%">
      <Heading fontSize="3xl">Agent Admin Home</Heading>
      <Text>
        Welcome, Agent Admin! Here you can view assigned clients, upload documents, and manage your calendar.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={10} spacingY={10} minChildWidth="220px">
        {menuItems.map((item) => (
          <Box
            key={item.label}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p={8}
            transition="all 0.2s"
            _hover={{ boxShadow: "xl", transform: "translateY(-4px) scale(1.03)", zIndex: 1 }}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Flex align="center" mb={5}>
              <Box
                bg={item.color}
                borderRadius="full"
                p={4}
                mr={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={item.icon} color="white" boxSize={8} />
              </Box>
              <Heading size="md">{item.label}</Heading>
            </Flex>
            <Text mb={6} color="gray.600">{item.description}</Text>
            <Button
              colorScheme={item.color.split(".")[0]}
              variant="outline"
              onClick={item.action}
              alignSelf="flex-end"
              size="md"
            >
              {item.label === "Upload Documents" ? "Upload" : item.label === "Add to Calendar" ? "Add" : "View"}
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default AgentAdminHome;
