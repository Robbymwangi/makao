import React from "react";
import { Box, Text, VStack, Image, Badge, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router";

const ProjectSelection = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: "Residential Casa du Panel",
      locations: ["Madrid", "Lisbon"],
      progress: 65,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 2,
      name: "Urban Skyline Apartments",
      locations: ["New York", "Chicago"],
      progress: 80,
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    },
  ];

  return (
    <VStack
      spacing={6}
      align={useBreakpointValue({ base: "center", md: "stretch" })} // Center on smaller screens
      p={4}
    >
      <Text
        fontSize="4xl"
        fontWeight="bold"
        mb={8}
        fontFamily={"Playfair Display, serif"}
        textAlign={useBreakpointValue({ base: "center", md: "left" })} // Center title on smaller screens
      >
        Select a Project
      </Text>
      {projects.map((project) => (
        <Box
          key={project.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          onClick={() => navigate(`/dashboard/myprojects/${project.id}`)}
          cursor="pointer"
          marginBottom={4}
          w={useBreakpointValue({ base: "100%", md: "100%" })} 
        >
          <Image src={project.image} alt={project.name} objectFit="cover" w="100%" h="200px" />
          <Box p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {project.name}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Locations: {project.locations.join(", ")}
            </Text>
            <Stack direction="row" spacing={2}>
              <Badge colorScheme="green">Progress: {project.progress}%</Badge>
            </Stack>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default ProjectSelection;