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
  Timeline,
  Stack,
  CloseButton,
  Dialog,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  ChevronRight,
  FileText,
  Construction,
  Check,
  Package,
  Ship,
  Star,
  Users,
  Building2,
} from "lucide-react";

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    name: "Residential Casa du Panel",
    client: "Jane Smith",
    submittedAt: new Date("2025-07-01T10:00:00Z"),
    status: "Pending",
    description: "A modern residential project in Madrid.",
    location: "Madrid, Spain",
    contractors: [
      {
        name: "Metano Construction",
        role: "General Contractor",
        performance: "A+",
        documentsVerified: true,
      },
    ],
    consultantFeedback: [
      {
        consultant: "Dr. Alice Johnson",
        rating: 5,
        date: "2025-07-03",
        feedback: "Excellent documentation and planning.",
      },
    ],
    milestones: [
      {
        id: 1,
        phase: "Phase 1 Started",
        date: "21st February 2023",
        description: "Initial phase of the project began with planning and design.",
        icon: Ship,
      },
      {
        id: 2,
        phase: "Phase 1 Completed",
        date: "4th April 2023",
        description: "Phase 1 completed with 70% progress achieved.",
        icon: Check,
      },
      {
        id: 3,
        phase: "Next Phase Preparation",
        date: "Ongoing",
        description: "Preparing for the next phase of the project.",
        icon: Package,
      },
    ],
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
    submittedAt: new Date("2025-07-02T14:30:00Z"),
    status: "Pending",
    description: "Luxury apartments in New York.",
    location: "New York, USA",
    contractors: [
      {
        name: "Skyline Builders",
        role: "General Contractor",
        performance: "A",
        documentsVerified: false,
      },
    ],
    consultantFeedback: [
      {
        consultant: "Dr. Bob Smith",
        rating: 4,
        date: "2025-07-04",
        feedback: "Solid proposal, minor clarifications needed.",
      },
    ],
    milestones: [
      {
        id: 1,
        phase: "Planning",
        date: "1st March 2025",
        description: "Project planning and resource allocation.",
        icon: Ship,
      },
    ],
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
            <Dialog.Content maxW="4xl">
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
                  <VStack spacing={6} align="stretch">
                    {/* Project Card */}
                    <Box>
                      <Card.Root w="100%" position="relative" borderRadius="lg" overflow="hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                          alt={selectedProject.name}
                          objectFit="cover"
                          w="100%"
                          h="220px"
                        />
                        <Box
                          p={6}
                          position="absolute"
                          bottom="0"
                          left="0"
                          color="white"
                          bg="rgba(0, 0, 0, 0.6)"
                          w="100%"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="flex-start"
                          borderBottomRadius="lg"
                        >
                          <Text fontSize="lg" fontWeight="bold" mb={2}>
                            {selectedProject.name}
                          </Text>
                          <Text fontSize="md" color="gray.300" mb={2}>
                            {selectedProject.location}
                          </Text>
                          <Stack direction="row" spacing={2} mb={2}>
                            <Badge colorScheme="green" fontSize="sm">
                              <Construction size={14} />
                              Pending Approval
                            </Badge>
                          </Stack>
                        </Box>
                      </Card.Root>
                    </Box>

                    {/* Project Stats */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Box>
                        <HStack spacing={4} mb={3}>
                          <Users size={20} />
                          <Text fontWeight="bold">Contractors</Text>
                        </HStack>
                        <Text fontSize="2xl">{selectedProject.contractors.length}</Text>
                        <Text fontSize="sm" color="gray.500">Active on project</Text>
                      </Box>
                      <Box>
                        <HStack spacing={4} mb={3}>
                          <Building2 size={20} />
                          <Text fontWeight="bold">Project Phase</Text>
                        </HStack>
                        <Text fontSize="2xl">Approval</Text>
                        <Text fontSize="sm" color="gray.500">Awaiting admin action</Text>
                      </Box>
                      <Box>
                        <HStack spacing={4} mb={3}>
                          <Star size={20} />
                          <Text fontWeight="bold">Feedback Score</Text>
                        </HStack>
                        <Text fontSize="2xl">
                          {selectedProject.consultantFeedback.length > 0
                            ? (
                              selectedProject.consultantFeedback.reduce((sum, f) => sum + f.rating, 0) /
                              selectedProject.consultantFeedback.length
                            ).toFixed(1)
                            : "N/A"}
                          /5
                        </Text>
                        <Text fontSize="sm" color="gray.500">Consultant reviews</Text>
                      </Box>
                    </SimpleGrid>

                    {/* Contractor Management */}
                    <Box>
                      <Heading size="md" mb={4}>Contractor Management</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {selectedProject.contractors.map((contractor, idx) => (
                          <Card.Root key={idx} p={6}>
                            <HStack spacing={4} align="start">
                              <Avatar.Root size="lg">
                                <Avatar.Fallback name={contractor.name} />
                              </Avatar.Root>
                              <VStack align="start" spacing={2} flex={1}>
                                <Text fontWeight="bold">{contractor.name}</Text>
                                <Text color="gray.600">{contractor.role}</Text>
                                <HStack>
                                  <Star size={16} fill="gold" stroke="gold" />
                                  <Text>{contractor.performance}</Text>
                                </HStack>
                                <Badge colorScheme={contractor.documentsVerified ? "green" : "yellow"}>
                                  {contractor.documentsVerified ? "Documents Verified" : "Pending Verification"}
                                </Badge>
                              </VStack>
                            </HStack>
                          </Card.Root>
                        ))}
                      </SimpleGrid>
                    </Box>

                    {/* Consultant Feedback */}
                    <Box>
                      <Heading size="md" mb={4}>Consultant Feedback</Heading>
                      <Timeline.Root>
                        {selectedProject.consultantFeedback.map((feedback, idx) => (
                          <Timeline.Item key={idx}>
                            <Timeline.Connector>
                              <Timeline.Separator />
                              <Timeline.Indicator>
                                <FileText size={16} />
                              </Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content>
                              <Timeline.Title>
                                <HStack>
                                  <Text fontWeight="bold">{feedback.consultant}</Text>
                                  <HStack spacing={1}>
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        fill={i < feedback.rating ? "gold" : "none"}
                                        stroke={i < feedback.rating ? "gold" : "gray"}
                                      />
                                    ))}
                                  </HStack>
                                </HStack>
                              </Timeline.Title>
                              <Timeline.Description>{feedback.date}</Timeline.Description>
                              <Text mt={2}>{feedback.feedback}</Text>
                            </Timeline.Content>
                          </Timeline.Item>
                        ))}
                      </Timeline.Root>
                    </Box>

                    {/* Milestones */}
                    <Box>
                      <Heading size="md" mb={4}>Milestones</Heading>
                      <Timeline.Root>
                        {selectedProject.milestones.map((milestone) => (
                          <Timeline.Item key={milestone.id}>
                            <Timeline.Connector>
                              <Timeline.Separator />
                              <Timeline.Indicator>
                                <milestone.icon />
                              </Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content>
                              <Timeline.Title>{milestone.phase}</Timeline.Title>
                              <Timeline.Description>{milestone.date}</Timeline.Description>
                              <Text textStyle="sm">{milestone.description}</Text>
                            </Timeline.Content>
                          </Timeline.Item>
                        ))}
                      </Timeline.Root>
                    </Box>

                    {/* Uploaded Documents */}
                    <Box>
                      <Heading size="md" mb={4}>Project Documents</Heading>
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