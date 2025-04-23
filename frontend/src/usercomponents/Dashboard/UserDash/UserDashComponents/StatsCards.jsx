import React from "react";
import { SimpleGrid, Stat, HStack, FormatNumber } from "@chakra-ui/react";
import { Clock, Check } from "lucide-react";

const StatsCards = () => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
      <Stat.Root p={4} borderWidth="1px" borderRadius="xl" boxShadow="xl">
        <HStack spacing={4} mb={3}>
          <Clock size={20} />
          <Stat.Label>Current Phase</Stat.Label>
        </HStack>
        <Stat.ValueText fontSize="2xl">Foundation Work</Stat.ValueText>
        <Stat.HelpText mt={2}>Due in 14 days</Stat.HelpText>
      </Stat.Root>

      <Stat.Root p={4} borderWidth="1px" borderRadius="xl" boxShadow="xl">
        <HStack spacing={4} mb={3}>
          <Check size={20} />
          <Stat.Label>Next Milestone</Stat.Label>
        </HStack>
        <Stat.ValueText fontSize="2xl">Wall Completion</Stat.ValueText>
        <Stat.HelpText mt={2}>80% completed</Stat.HelpText>
      </Stat.Root>

      <Stat.Root p={4} borderWidth="1px" borderRadius="xl" boxShadow="xl">
        <HStack spacing={4} mb={3}>
          <Check size={20} />
          <Stat.Label>Financial Health</Stat.Label>
        </HStack>
        <Stat.ValueText>
          <FormatNumber value={8456.4} style="currency" currency="USD" />
        </Stat.ValueText>
        <Stat.HelpText mt={2}>80% completed</Stat.HelpText>
      </Stat.Root>
    </SimpleGrid>
  );
};

export default StatsCards;