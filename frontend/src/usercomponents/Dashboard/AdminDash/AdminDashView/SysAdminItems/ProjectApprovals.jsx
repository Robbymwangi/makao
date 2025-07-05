import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Heading,
  CloseButton,
  Dialog,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { FileText } from "lucide-react";

const statusColor = {
  Pending: "orange",
  Approved: "green",
  Rejected: "red",
};

const ProjectApprovals = () => {
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  const handleApprove = async (id) => {
    await fetch(`http://localhost:3000/projects/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    });
    // Re-fetch projects from backend
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
    setDialogOpen(false);
  };

  const handleReject = async (id) => {
    await fetch(`http://localhost:3000/projects/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    });
    // Re-fetch projects from backend
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
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
                <Text fontWeight="bold">{project.project_name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Submitted by {project.client?.full_name} on{" "}
                  {project.submitted_at
                    ? new Date(project.submitted_at).toLocaleString()
                    : ""}
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
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={({ open }) => setDialogOpen(open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="lg">
              <Dialog.Header>
                <Dialog.Title>
                  {selectedProject?.project_name || "Project"}
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
                      <Heading size="md" mb={3}>
                        Client Information
                      </Heading>
                      <Text>
                        <b>Name:</b> {selectedProject.client?.full_name}
                      </Text>
                      <Text>
                        <b>Address:</b> {selectedProject.client?.address}
                      </Text>
                    </Box>
                    {/* Location */}
                    <Box pt={2}>
                      <Heading size="md" mb={3}>
                        Location
                      </Heading>
                      <Text>{selectedProject.location}</Text>
                    </Box>
                    {/* Estimated Budget & Timeline */}
                    <SimpleGrid columns={2} spacing={8} pt={2}>
                      <Box>
                        <Heading size="sm" mb={2}>
                          Estimated Budget
                        </Heading>
                        <Text fontSize="lg" fontWeight="semibold">
                          {selectedProject.estimated_budget}
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="sm" mb={2}>
                          Estimated Timeline
                        </Heading>
                        <Text fontSize="lg" fontWeight="semibold">
                          {selectedProject.estimated_timeline}
                        </Text>
                      </Box>
                    </SimpleGrid>
                    {/* Uploaded Documents */}
                    <Box pt={2}>
                      <Heading size="md" mb={3}>
                        Support Documents
                      </Heading>
                      {selectedProject.project_documents &&
                      selectedProject.project_documents.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {selectedProject.project_documents.map((file) => (
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
                                {file.url && (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Download
                                  </a>
                                )}
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