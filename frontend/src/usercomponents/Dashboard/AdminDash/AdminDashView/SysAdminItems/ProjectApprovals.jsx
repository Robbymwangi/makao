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
  SimpleGrid,
  Portal,
  Skeleton,
} from "@chakra-ui/react";
import { FileText } from "lucide-react";
import supabase from "@/utils/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore"; 

const statusColor = {
  Pending: "orange",
  Approved: "green",
  Rejected: "red",
};

const ProjectApprovals = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const jwt = useAuthStore((state) => state.token); // Get JWT

  // Fetch pending approvals, joining users table for client info
  useEffect(() => {
    const fetchApprovals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("project_approvals")
        .select(`
          *,
          users:user_id (id, full_name, email)
        `)
        .eq("status", "Pending");
      if (!error && data) setProjects(data);
      setLoading(false);
    };
    fetchApprovals();
  }, []);

  // Approve handler: call Edge Function
  const handleApprove = async (project) => {
    const res = await fetch(
      "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/project-approval/process",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approval_id: project.id,
          status: "Approved",
          // Optionally: agent_id: ...
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setDialogOpen(false);
    } else {
      alert(data.error || "Failed to approve project");
    }
  };

  // Reject handler: call Edge Function
  const handleReject = async (project) => {
    const res = await fetch(
      "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/project-approvals/process",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approval_id: project.id,
          status: "Rejected",
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setDialogOpen(false);
    } else {
      alert(data.error || "Failed to reject project");
    }
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
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        p={4}
        mx={{ base: 0, md: 24 }} // Increased from md: 8 to md: 24 for more width
        mb={4}
        minH="60vh"
        maxW="6xl" // Add a maximum width for large screens
        width="100%"
        alignSelf="center"
      >
        <VStack
          spacing={0}
          align="stretch"
          flexGrow={1}
          overflowY="auto"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Box
                key={idx}
                p={4}
                borderBottom="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                mb={3}
              >
                <Skeleton height="24px" mb={2} />
                <Skeleton height="16px" mb={1} />
                <Skeleton height="16px" width="40%" />
              </Box>
            ))
          ) : projects.length === 0 ? (
            <Box p={12} textAlign="center" color="gray.500">
              No projects available to approve.
            </Box>
          ) : (
            projects.map((project) => (
              <Box
                key={project.id}
                p={4}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                mb={3}
                cursor="pointer"
                _hover={{ bg: "gray.50", boxShadow: "md" }}
                onClick={() => openDialog(project)}
                transition="box-shadow 0.2s"
              >
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{project.project_name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Client: <b>
                        {project.users?.full_name ||
                          project.users?.email ||
                          project.user_id ||
                          "Unknown"}
                      </b>
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Submitted on{" "}
                      {project.created_at
                        ? new Date(project.created_at).toLocaleString()
                        : "Unknown"}
                    </Text>
                  </Box>
                  <Badge colorScheme={statusColor[project.status] || "gray"}>
                    {project.status}
                  </Badge>
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      </Box>

      {/* Project Details Dialog */}
      {dialogOpen && selectedProject && (
        <Portal>
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.400"
            zIndex={1400}
            onClick={() => setDialogOpen(false)}
          />
          <Flex
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            maxW="lg"
            w="100%"
            zIndex={1500}
            direction="column"
          >
            <Box p={6} borderBottomWidth="1px" position="relative">
              <Heading size="lg">
                {selectedProject.project_name || "Project"}
              </Heading>
              <CloseButton
                size="sm"
                position="absolute"
                top="2"
                right="2"
                onClick={() => setDialogOpen(false)}
              />
            </Box>
            <Box p={6} pt={4} overflowY="auto" maxH="70vh">
              <VStack
                spacing={8}
                align="stretch"
                divider={<Box borderBottomWidth="1px" borderColor="gray.200" />}
              >
                {/* Client Info */}
                <Box pt={0}>
                  <Heading size="md" mb={3}>Client Information</Heading>
                  <Text>
                    <b>Client:</b>{" "}
                    {selectedProject.users?.full_name ||
                      selectedProject.users?.email ||
                      selectedProject.user_id ||
                      "Unknown"}
                  </Text>
                  <Text>
                    <b>Address:</b> {selectedProject.client_address || "Unknown"}
                  </Text>
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
                    <Text fontSize="lg" fontWeight="semibold">
                      {selectedProject.estimated_budget}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="sm" mb={2}>Estimated Timeline</Heading>
                    <Text fontSize="lg" fontWeight="semibold">
                      {selectedProject.estimated_timeline}
                    </Text>
                  </Box>
                </SimpleGrid>
                {/* Additional Details */}
                <Box pt={2}>
                  <Heading size="md" mb={3}>Additional Details</Heading>
                  <Text>{selectedProject.additional_details || "None"}</Text>
                </Box>
                {/* Uploaded Documents */}
                <Box pt={2}>
                  <Heading size="md" mb={3}>Support Documents</Heading>
                  {selectedProject.documents && selectedProject.documents.length > 0 ? (
                    <VStack spacing={4} align="stretch">
                      {selectedProject.documents.map((file, idx) => (
                        <Box
                          key={file.url || file.id || idx}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          _hover={{ bg: "gray.50" }}
                        >
                          <HStack spacing={4} align="center">
                            <FileText size={20} />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="bold">
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  {file.name}
                                </a>
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {file.type?.toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Uploaded: {file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : "Unknown"}
                              </Text>
                            </VStack>
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
            </Box>
            <Box p={6} pt={0} borderTopWidth="1px">
              {selectedProject.status === "Pending" && (
                <HStack>
                  <Button
                    colorScheme="green"
                    onClick={() => handleApprove(selectedProject)}
                  >
                    Approve
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleReject(selectedProject)}
                  >
                    Reject
                  </Button>
                </HStack>
              )}
            </Box>
          </Flex>
        </Portal>
      )}
    </Flex>
  );
};

export default ProjectApprovals;