import React from "react";
import {
  Box,
  Text,
  VStack,
  Image,
  Badge,
  Stack,
  useBreakpointValue,
  SimpleGrid,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Plus, Users, Construction } from "lucide-react";

const ProjectSelection = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: "Residential Casa du Panel",
      locations: ["Madrid", "Lisbon"],
      progress: 65,
      clientCount: 3,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 2,
      name: "Urban Skyline Apartments",
      locations: ["New York", "Chicago"],
      progress: 80,
      clientCount: 5,
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
  ];

  return (
    <VStack
      spacing={6}
      align={useBreakpointValue({ base: "center", md: "stretch" })}
      p={4}
    >
      <HStack justify="space-between" align="center" w="100%">
        <Text
          fontSize="4xl"
          fontWeight="bold"
          mb={8}
          fontFamily={"Playfair Display, serif"}
          textAlign={useBreakpointValue({ base: "center", md: "left" })}
        >
          Manage Projects
        </Text>
        <Button leftIcon={<Plus size={16} />} colorScheme="blue">
          New Project
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {projects.map((project) => (
          <Box
            key={project.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            onClick={() => navigate(`/admin-dashboard/projects/${project.id}`)}
            cursor="pointer"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <Image
              src={project.image}
              alt={project.name}
              objectFit="cover"
              w="100%"
              h="200px"
            />
            <Box p={4}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {project.name}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Locations: {project.locations.join(", ")}
              </Text>
              <Stack direction="row" spacing={2} mb={4}>
                <Badge colorScheme="green" display="flex" alignItems="center" gap={2}>
                  <Construction size={14} />
                  Progress: {project.progress}%
                </Badge>
                <Badge colorScheme="blue" display="flex" alignItems="center" gap={2}>
                  <Users size={14} />
                  {project.clientCount} Clients
                </Badge>
              </Stack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default ProjectSelection; 