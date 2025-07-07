import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Text,
  VStack,
  Image,
  Badge,
  Stack,
  SimpleGrid,
  Button,
  HStack,
  Avatar,
  useBreakpointValue,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore"; // adjust path as needed
import supabase from "@/utils/supabaseClient"; // Make sure you have this

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/get-agent-projects";

const ProjectSelection = () => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Move all hooks to the top level, including useBreakpointValue
  const align = useBreakpointValue({ base: "center", md: "stretch" });
  const textAlign = useBreakpointValue({ base: "center", md: "left" });

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      // Get the latest session and access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        setLoading(false);
        return;
      }
      const res = await fetch(EDGE_URL, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      setClients(data.clients || []);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="400px"
        w="100%"
      >
        <Spinner size="xl" />
        <Text mt={4} color="gray.500">
          Loading projects...
        </Text>
      </Flex>
    );
  }

  return (
    <VStack
      spacing={6}
      align={align}
      p={4}
    >
      <HStack justify="space-between" align="center" w="100%">
        <Text
          fontSize="4xl"
          fontWeight="bold"
          mb={8}
          fontFamily={"Playfair Display, serif"}
          textAlign={textAlign}
        >
          Manage Projects
        </Text>
        <Button leftIcon={<Plus size={16} />} colorScheme="blue">
          New Project
        </Button>
      </HStack>

      {/* Grouped by client */}
      <Box w="100%" divideY="2px">
        {clients.map((client, idx) => (
          <Box key={client.id} w="100%" py={4} {...(idx !== 0 && { borderTopWidth: "2px", borderColor: "gray.100" })}>
            <HStack mb={4} spacing={4}>
              <Avatar.Root>
                <Avatar.Fallback name={client.full_name || client.email} />
              </Avatar.Root>
              <Text fontSize="2xl" fontWeight="bold">
                {client.full_name || client.email}
              </Text>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {client.projects.map((project) => (
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
                  {/* You may want to add a project image if available */}
                  <Box p={4}>
                    <Text fontSize="xl" fontWeight="bold" mb={2}>{project.project_name}</Text>
                    <Text fontSize="sm" color="gray.500" mb={4}>
                      Location: {project.location}
                    </Text>
                    <Stack direction="row" spacing={2} mb={4}>
                      <Badge colorScheme="green">Status: {project.status}</Badge>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default ProjectSelection;