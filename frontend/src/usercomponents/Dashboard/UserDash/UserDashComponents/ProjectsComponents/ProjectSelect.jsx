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
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { getProjectStatus, submitProjectApproval } from "@/api/projectApproval";

const ProjectSelect = () => {
  const jwt = useAuthStore((state) => state.token);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
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
    if (!jwt) return;
    setLoading(true);
    getProjectStatus(jwt)
      .then(setStatus)
      .finally(() => setLoading(false));
  }, [jwt]);

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

  // Show pending projects grayed out
  if (status?.pending_projects?.length > 0) {
    return (
      <VStack spacing={6} p={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Your Projects
        </Text>
        {status.pending_projects.map((project) => (
          <Box
            key={project.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            opacity={0.5}
            cursor="not-allowed"
            onClick={() => setShowDialog(true)}
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
        <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
          <Dialog.Content maxW="sm">
            <Dialog.Body>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Project is due for approval.
              </Text>
              <Text>Please try again later.</Text>
              <Button mt={4} onClick={() => setShowDialog(false)}>
                Close
              </Button>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </VStack>
    );
  }

  // Use the same empty project logic as UserDashboard
  if (!status?.has_approved_project) {
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
        <Button colorScheme="blue" mt={4} onClick={() => setShowDialog(true)}>
          Submit Project Details
        </Button>
        <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>Submit Project Details</Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <Button onClick={() => setShowDialog(false)}>Close</Button>
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
                      onClick={async () => {
                        await submitProjectApproval(jwt, form);
                        setShowDialog(false);
                        setLoading(true);
                        getProjectStatus(jwt)
                          .then(setStatus)
                          .finally(() => setLoading(false));
                      }}
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