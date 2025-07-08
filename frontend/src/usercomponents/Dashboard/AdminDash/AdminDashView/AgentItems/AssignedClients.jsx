import React, { useState, useEffect, useRef } from "react";
import {
  Box, VStack, HStack, Text, Heading, Avatar, Badge, Button, Card,
  Flex, Icon, Spinner,
} from "@chakra-ui/react";
import {
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient";

const EDGE_FUNCTION_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/get-assigned-clients";
const PROJECT_DOCS_EDGE_FUNCTION = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/project-documents";

const AssignedClients = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorizedDocs, setCategorizedDocs] = useState(null);
  const [docsLoading, setDocsLoading] = useState(false);
  const fileInputRef = useRef();

  const user = useAuthStore((state) => state.user);

  // Fetch assigned clients
  const fetchAssignedClients = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error(`Failed to get session: ${sessionError.message}`);
      if (!session || !session.access_token) throw new Error('No valid session found');
      if (!user?.id) throw new Error('No user ID available');

      const authHeader = `Bearer ${session.access_token}`;
      const res = await fetch(`${EDGE_FUNCTION_URL}?agent_id=${user.id}`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch clients');
      }

      const data = await res.json();
      setClients(data);
      if (data.length > 0) {
        setSelectedClient(data[0].id);
        setSelectedProjectId(data[0].projects?.[0]?.id || null);
      }
    } catch (err) {
      toaster.create({
        title: "Error",
        description: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssignedClients();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fetch categorized documents when selectedProjectId changes
  useEffect(() => {
    const fetchCategorizedDocs = async () => {
      if (!selectedProjectId || !user) {
        setCategorizedDocs(null);
        return;
      }
      setDocsLoading(true);
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        if (!token) throw new Error("No session token");

        const res = await fetch(
          `${PROJECT_DOCS_EDGE_FUNCTION}?projectId=${selectedProjectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch project documents");
        setCategorizedDocs(data.files || {});
      } catch (err) {
        setCategorizedDocs(null);
        toaster.create({ description: err.message, type: "error" });
      } finally {
        setDocsLoading(false);
      }
    };
    fetchCategorizedDocs();
  }, [selectedProjectId, user]);

  // Helpers
  const selectedClientObj = clients.find((c) => c.id === selectedClient);
  const selectedProjectObj = selectedClientObj?.projects?.find((p) => p.id === selectedProjectId);

  // Upload handler (not yet adapted for new project_files structure)
  const handleUpload = async (e) => {
    // Implement upload logic as needed for your storage and DB
    toaster.create({
      description: "Upload logic not implemented in this snippet.",
      type: "info",
    });
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading assigned clients...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8} direction={{ base: "column", md: "row" }}>
        <Heading size="2xl" fontWeight="bold" fontFamily="'Playfair Display', serif">
          Assigned Clients
        </Heading>
      </Flex>

      {clients.length === 0 ? (
        <Box p={8} borderWidth="1px" borderRadius="lg" textAlign="center">
          <Text fontSize="lg">No clients assigned yet.</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            {user?.email && `Logged in as: ${user.email}`}
          </Text>
        </Box>
      ) : (
        <Flex gap={4} direction={{ base: "column", md: "row" }} align="stretch">
          {/* Left: Client List */}
          <Box
            flex="1"
            minW="260px"
            minH="700px" // <-- Make box longer
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            display="flex"
            flexDirection="column"
            justifyContent="stretch"
            p={0}
          >
            <Box borderBottomWidth="1px" p={4}>
              <Heading size="md">Clients</Heading>
            </Box>
            <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" p={4}>
              {clients.map((client) => (
                <Card.Root
                  key={client.id}
                  p={4}
                  onClick={() => {
                    setSelectedClient(client.id);
                    setSelectedProjectId(client.projects?.[0]?.id || null);
                  }}
                  cursor="pointer"
                  bg={selectedClient === client.id ? "blue.50" : "white"}
                  _hover={{ bg: "gray.50" }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing={4}>
                      <Avatar.Root>
                        <Avatar.Fallback name={client.full_name || client.email} />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="bold">{client.full_name || client.email}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {client.projects?.[0]?.project_name || "No active projects"}
                        </Text>
                      </Box>
                    </HStack>
                  </Flex>
                </Card.Root>
              ))}
            </VStack>
          </Box>

          {/* Middle: Project List */}
          <Box
            flex="1"
            minW="260px"
            minH="700px" // <-- Make box longer
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            display="flex"
            flexDirection="column"
            justifyContent="stretch"
            p={0}
          >
            <Box borderBottomWidth="1px" p={4}>
              <Heading size="md">Projects</Heading>
            </Box>
            <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" p={4}>
              {selectedClientObj && selectedClientObj.projects?.length > 0 ? (
                selectedClientObj.projects.map((project) => (
                  <Card.Root
                    key={project.id}
                    p={4}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                    }}
                    cursor="pointer"
                    bg={selectedProjectId === project.id ? "blue.50" : "white"}
                    _hover={{ bg: "gray.50" }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="bold">{project.project_name}</Text>
                        <Text fontSize="sm" color="gray.500">{project.location}</Text>
                      </Box>
                    </Flex>
                  </Card.Root>
                ))
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  {selectedClientObj ? "No projects for this client" : "Select a client to view projects"}
                </Text>
              )}
            </VStack>
          </Box>

          {/* Right: Documents for selected project */}
          <Box
            flex="2"
            minW="320px"
            minH="700px" // <-- Make box longer
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            display="flex"
            flexDirection="column"
            justifyContent="stretch"
            p={0}
          >
            <Box borderBottomWidth="1px" p={4}>
              <Heading size="md">
                {selectedProjectObj
                  ? `Documents for ${selectedProjectObj.project_name}`
                  : "Documents"}
              </Heading>
            </Box>
            <Box flexGrow={1} p={6}>
              {docsLoading ? (
                <Flex direction="column" align="center" justify="center" height="100%">
                  <Spinner size="lg" />
                  <Text mt={4} color="gray.500">
                    Loading documents...
                  </Text>
                </Flex>
              ) : selectedProjectObj ? (
                categorizedDocs ? (
                  Object.entries(categorizedDocs).map(([category, files]) => (
                    <Box key={category} mb={6}>
                      <Heading size="sm" mb={2} color="gray.600" textTransform="capitalize">
                        {category} {files.length > 0 ? `(${files.length})` : ""}
                      </Heading>
                      {files.length === 0 ? (
                        <Text color="gray.400" fontSize="sm" mb={2}>No files in this category.</Text>
                      ) : (
                        <VStack align="stretch" spacing={3}>
                          {files.map((doc) => (
                            <Flex
                              key={doc.id}
                              p={3}
                              borderWidth="1px"
                              borderRadius="md"
                              justify="space-between"
                              align="center"
                            >
                              <HStack>
                                <FileText size={16} />
                                {doc.file_url ? (
                                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">{doc.file_name}</a>
                                ) : (
                                  <Text>{doc.file_name}</Text>
                                )}
                                <Text color="gray.500" fontSize="xs" ml={2}>
                                  {doc.uploader?.full_name && `by ${doc.uploader.full_name}`}
                                </Text>
                              </HStack>
                              <HStack>
                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  onClick={async () => {
                                    // Optional: implement delete logic for project_files here
                                  }}
                                >
                                  Delete
                                </Button>
                              </HStack>
                            </Flex>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No documents available
                  </Text>
                )
              ) : (
                <Box p={8} textAlign="center" color="gray.500">
                  <Text>Select a project to view documents</Text>
                </Box>
              )}
            </Box>
          </Box>
        </Flex>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
    </Box>
  );
};

export default AssignedClients;