import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Heading,
  Avatar,
  Card,
  Image,
  Stack,
  CloseButton,
  Dialog,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { FileText } from "lucide-react";

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    name: "Residential Casa du Panel",
    client: "Jane Smith",
    clientAddress: "123 Main St, Madrid, Spain",
    submittedAt: new Date("2025-07-01T10:00:00Z"),
    status: "Pending",
    location: "Madrid, Spain",
    estimatedBudget: "KES 2,000,000",
    estimatedTimeline: "18 months",
    documents: [
      {
        id: 1,
        name: "Blueprint.pdf",
        source: "Jane Smith",
        date: "2025-07-01",
      },
      {
        id: 2,
        name: "Permit.pdf",
        source: "Jane Smith",
        date: "2025-07-01",
      },
    ],
  },
  {
    id: 2,
    name: "Urban Skyline Apartments",
    client: "John Doe",
    clientAddress: "456 Park Ave, New York, USA",
    submittedAt: new Date("2025-07-02T14:30:00Z"),
    status: "Pending",
    location: "New York, USA",
    estimatedBudget: "KES 5,500,000",
    estimatedTimeline: "24 months",
    documents: [
      {
        id: 1,
        name: "Proposal.pdf",
        source: "John Doe",
        date: "2025-07-02",
      },
    ],
  },
];

const statusColor = {
  Pending: "orange",
  Approved: "green",
  Rejected: "red",
};

const ProjectApprovals = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleApprove = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Approved" } : p
      )
    );
    setDialogOpen(false);
  };

  const handleReject = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Rejected" } : p
      )
    );
    setDialogOpen(false);
  };

  const openDialog = (project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      <Heading
        size="3xl"
        fontWeight="bold"
        mb={6}
        fontFamily="'Playfair Display', serif"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }}
      >
        Project Approvals
      </Heading>
      <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto">
        {projects.map((project) => (
          <Box
            key={project.id}
            p={4}
            borderBottomWidth="1px"
            borderColor="gray.100"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            onClick={() => openDialog(project)}
          >
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">{project.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Submitted by {project.client} on{" "}
                  {new Date(project.submittedAt).toLocaleString()}
                </Text>
              </Box>
              <Badge colorScheme={statusColor[project.status] || "gray"}>
                {project.status}
              </Badge>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Project Details Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={({ open }) => setDialogOpen(open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="lg">
              <Dialog.Header>
                <Dialog.Title>
                  {selectedProject?.name || "Project"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton
                    size="sm"
                    position="absolute"
                    top="2"
                    right="2"
                  />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body pb="8">
                {selectedProject && (
                  <VStack
                    spacing={8}
                    align="stretch"
                    divideY={2}
                    divideColor="gray.200"
                  >
                    {/* Client Info */}
                    <Box pt={0}>
                      <Heading size="md" mb={3}>Client Information</Heading>
                      <Text><b>Name:</b> {selectedProject.client}</Text>
                      <Text><b>Address:</b> {selectedProject.clientAddress}</Text>
                    </Box>
                    {/* Location */}
                    <Box pt={2}>
                      <Heading size="md" mb={3}>Location</Heading>
                      <Text>{selectedProject.location}</Text>
                    </Box>
                    {/* Estimated Budget & Timeline */}
                    <SimpleGrid columns={2} spacing={8} pt={2}>
                      <Box>
                        <Heading size="sm" mb={2}>Estimated Budget</Heading>
                        <Text fontSize="lg" fontWeight="semibold">{selectedProject.estimatedBudget}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm" mb={2}>Estimated Timeline</Heading>
                        <Text fontSize="lg" fontWeight="semibold">{selectedProject.estimatedTimeline}</Text>
                      </Box>
                    </SimpleGrid>
                    {/* Uploaded Documents */}
                    <Box pt={2}>
                      <Heading size="md" mb={3}>Support Documents</Heading>
                      {selectedProject.documents && selectedProject.documents.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {selectedProject.documents.map((file) => (
                            <Box
                              key={file.id}
                              p={3}
                              borderWidth="1px"
                              borderRadius="md"
                              _hover={{ bg: "gray.50" }}
                            >
                              <HStack spacing={4} align="center">
                                <FileText size={20} />
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="bold">
                                    {file.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Sent by {file.source}
                                  </Text>
                                </VStack>
                                <Text fontSize="xs" color="gray.500" ml="auto">
                                  {file.date}
                                </Text>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          No files uploaded yet.
                        </Text>
                      )}
                    </Box>
                  </VStack>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                {selectedProject && selectedProject.status === "Pending" && (
                  <HStack>
                    <Button
                      colorScheme="green"
                      onClick={() => handleApprove(selectedProject.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleReject(selectedProject.id)}
                    >
                      Reject
                    </Button>
                  </HStack>
                )}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};

export default ProjectApprovals;