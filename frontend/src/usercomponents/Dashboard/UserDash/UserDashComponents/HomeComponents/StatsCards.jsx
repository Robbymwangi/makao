import React from "react";
import { SimpleGrid, Stat, HStack, FormatNumber, GridItem } from "@chakra-ui/react";
import { Clock, Check } from "lucide-react";

const StatsCards = () => {
  // Example data, could be replaced with props or fetched data
  const stats = [
    {
      icon: <Clock size={20} />,
      label: "Current Phase",
      value: "Foundation Work",
      help: "Due in 14 days",
    },
    {
      icon: <Check size={20} />,
      label: "Next Milestone",
      value: "Wall Completion",
      help: "80% completed",
    },
    {
      icon: <Check size={20} />,
      label: "Financial Health",
      value: (
        <FormatNumber value={8456.4} style="currency" currency="USD" />
      ),
      help: "80% completed",
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} columnGap="2" rowGap="4">
      {stats.map((stat, idx) => (
        <Stat.Root
          key={stat.label}
          p={4}
          borderWidth="1px"
          borderRadius="xl"
          boxShadow="sm"
          bg="white"
          _dark={{ bg: "gray.800" }}
          transition="box-shadow 0.2s"
          _hover={{ boxShadow: "md" }}
        >
          <HStack spacing={4} mb={3}>
            {stat.icon}
            <Stat.Label fontWeight="bold">{stat.label}</Stat.Label>
          </HStack>
          <Stat.ValueText fontSize="2xl">{stat.value}</Stat.ValueText>
          <Stat.HelpText mt={2} color="gray.500">
            {stat.help}
          </Stat.HelpText>
        </Stat.Root>
      ))}
      <GridItem
        borderWidth="1px"
        borderRadius="xl"
        boxShadow="sm"
        bg="white"
        _dark={{ bg: "gray.800" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100px"
      >
        <HStack spacing={4} mb={3}>
          <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Welcome to V1!
          </span>
        </HStack>
      </GridItem>
    </SimpleGrid>
  );
};

export default StatsCards;