import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Badge,
  Stack,
  Button,
  Dialog,
  Spinner,
  Portal,
  Input,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { submitProjectApproval } from "@/api/projectApproval";

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/check-user-projects";

const ProjectSelect = () => {
  const jwt = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [form, setForm] = useState({
    project_name: '',
    location: '',
    estimated_budget: '',
    estimated_timeline: '',
    client_address: '',
    additional_details: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserProjects() {
      setLoading(true);
      try {
        if (!jwt) {
          setShowSubmissionOverlay(false);
          setLoading(false);
          return;
        }
        const res = await fetch(EDGE_URL, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!res.ok) {
          setShowSubmissionOverlay(false);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
        setUserProjects(data.existingProjects || []);
        setUserRole(data.userRole || 'user');
      } catch (error) {
        setShowSubmissionOverlay(false);
      } finally {
        setLoading(false);
      }
    }
    if (user && jwt) {
      checkUserProjects();
    } else {
      setLoading(false);
    }
  }, [user, jwt]);

  const handleFormSubmit = async (formData) => {
    try {
      if (!jwt) return;
      // Submit the project approval
      await submitProjectApproval(jwt, formData);
      setIsFormOpen(false);
      setLoading(true);
      // Refresh the project status
      const res = await fetch(EDGE_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
      setUserProjects(data.existingProjects || []);
      setUserRole(data.userRole || 'user');
    } catch (error) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        textAlign="center"
        p={8}
      >
        <Spinner size="xl" color="black" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (showSubmissionOverlay) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        textAlign="center"
        p={8}
      >
        <Box maxW="lg" width="100%">
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            mb={2}
            color="gray.800"
          >
            Project Approval
          </Text>
          <Text
            fontSize="lg"
            color="gray.700"
            mb={4}
          >
            Please fill in your project details below to request approval and gain
            full access to the platform. All information will be reviewed by our
            team.
          </Text>
        </Box>
        <Button colorScheme="blue" mt={4} onClick={() => setIsFormOpen(true)}>
          Submit Project Details
        </Button>
        <Dialog.Root
          open={isFormOpen}
          onOpenChange={(details) => setIsFormOpen(details.open)}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>Submit Project Details</Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <Button onClick={() => setIsFormOpen(false)}>Close</Button>
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body>
                  <VStack spacing={4} align="stretch">
                    <Input
                      placeholder="Project Name"
                      value={form.project_name}
                      onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
                    />
                    <Input
                      placeholder="Location"
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    />
                    <Input
                      placeholder="Estimated Budget"
                      value={form.estimated_budget}
                      onChange={e => setForm(f => ({ ...f, estimated_budget: e.target.value }))}
                    />
                    <Input
                      placeholder="Estimated Timeline"
                      value={form.estimated_timeline}
                      onChange={e => setForm(f => ({ ...f, estimated_timeline: e.target.value }))}
                    />
                    <Input
                      placeholder="Client Address"
                      value={form.client_address}
                      onChange={e => setForm(f => ({ ...f, client_address: e.target.value }))}
                    />
                    <Input
                      placeholder="Additional Details"
                      value={form.additional_details}
                      onChange={e => setForm(f => ({ ...f, additional_details: e.target.value }))}
                    />
                    <Button
                      colorScheme="blue"
                      onClick={() => handleFormSubmit(form)}
                      isDisabled={
                        !form.project_name ||
                        !form.location ||
                        !form.estimated_budget ||
                        !form.estimated_timeline ||
                        !form.client_address
                      }
                    >
                      Submit
                    </Button>
                  </VStack>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Box>
    );
  }

  // Show pending projects grayed out
  const pendingProjects = userProjects.filter(
    project => project.status && project.status.toLowerCase() === 'pending'
  );

  // Show approved projects that can be selected
  const approvedProjects = userProjects.filter(
    project => project.status && project.status.toLowerCase() === 'approved'
  );

  if (pendingProjects.length > 0) {
    return (
      <VStack spacing={6} p={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Your Projects
        </Text>
        {pendingProjects.map((project) => (
          <Box
            key={project.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            opacity={0.5}
            cursor="not-allowed"
            w="100%"
            _hover={{ bg: "gray.50" }}
            p={4}
          >
            <Text fontWeight="bold" fontSize="lg">{project.project_name}</Text>
            <Text color="gray.500">{project.location}</Text>
            <Stack direction="row" spacing={2} mt={2}>
              <Badge colorScheme="orange">Pending Approval</Badge>
            </Stack>
          </Box>
        ))}
        <Text color="gray.500" mt={4}>
          Your projects are pending approval. Please wait for admin review.
        </Text>
      </VStack>
    );
  }

  if (approvedProjects.length > 0) {
    return (
      <VStack spacing={6} p={4} align="stretch">
        <Flex justify="space-between" align="center" w="100%">
          <Text
            fontSize="4xl"
            fontWeight="bold"
            mb={8}
            fontFamily={"Playfair Display, serif"}
          >
            Select a Project
          </Text>
          <Button colorScheme="blue" onClick={() => setIsFormOpen(true)}>
            New Project
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {approvedProjects.map((project) => (
            <Box
              key={project.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              cursor="pointer"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg", bg: "blue.50" }}
              transition="all 0.2s"
              onClick={() => navigate(`/dashboard/myprojects/${project.id}`)}
            >
              <Box p={4}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {project.project_name}
                </Text>
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
      </VStack>
    );
  }

  return (
    <VStack spacing={6} p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        No Projects Available
      </Text>
      <Text color="gray.500">You have no projects to select.</Text>
    </VStack>
  );
};

export default ProjectSelect;