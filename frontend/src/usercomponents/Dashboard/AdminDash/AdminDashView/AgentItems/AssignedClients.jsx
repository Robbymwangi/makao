import React, { useState, useEffect, useRef } from "react";
import {
  Box, VStack, HStack, Text, Heading, Avatar, Badge, Button, Card,
  SimpleGrid, Flex, Icon, Menu, Portal, Spinner,
} from "@chakra-ui/react";
import {
  Calendar as CalendarIcon, Upload, FileText, Plus, Clock,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient";

const EDGE_FUNCTION_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/get-assigned-clients";

const AssignedClients = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  const user = useAuthStore((state) => state.user);

  // Function to fetch assigned clients and their documents
  const fetchAssignedClients = async () => {
    try {
      // Get the latest session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Failed to get session: ${sessionError.message}`);
      }

      if (!session || !session.access_token) {
        throw new Error('No valid session found');
      }

      if (!user?.id) {
        throw new Error('No user ID available');
      }

      console.log("Fetching clients for agent ID:", user.id);

      // Format the auth header properly
      const authHeader = `Bearer ${session.access_token}`;
      console.log("Using auth header:", `${authHeader.substring(0, 20)}...`);

      const res = await fetch(`${EDGE_FUNCTION_URL}?agent_id=${user.id}`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || 'Failed to fetch clients');
      }

      const data = await res.json();

      // For each client, fetch documents for each project
      for (const client of data) {
        if (client.projects && client.projects.length > 0) {
          for (const project of client.projects) {
            const { data: docs, error: docsError } = await supabase
              .from('project_documents')
              .select('*')
              .eq('project_id', project.id);

            project.documents = docsError ? [] : docs;
          }
        }
      }

      setClients(data);
      if (data.length > 0) {
        setSelectedClient(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
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
  }, [user]); // Depend on 'user' to refetch if user state changes

  // Helper: Get events for selected date
  const getEventsForDate = (date) => {
    if (!selectedClient) return [];
    const client = clients.find((c) => c.id === selectedClient);
    if (!client) return [];
    // Flatten all events from all projects for this client
    const allEvents = client.projects?.flatMap((p) => p.events || []) || [];
    const dateStr = date.toISOString().split("T")[0];
    return allEvents.filter((event) => event.date === dateStr);
  };

  // Helper: Get documents for selected client
  const getDocumentsForSelectedClient = () => {
    const client = clients.find((c) => c.id === selectedClient);
    if (!client) return [];
    return client.projects?.flatMap((p) => p.documents || []) || [];
  };

  // Upload handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedClient) return;

    // Build a unique file path for this client
    const filePath = `client-${selectedClient}/${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file);

    if (error) {
      toaster.create({ description: `Upload failed: ${error.message}`, type: "error" });
      return;
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase
      .storage
      .from('project-documents')
      .getPublicUrl(filePath);

    // Add the uploaded document to the selected client's documents in state
    setClients((prev) =>
      prev.map((client) =>
        client.id === selectedClient
          ? {
              ...client,
              projects: client.projects.map((project) => ({
                ...project,
                documents: [
                  ...(project.documents || []),
                  {
                    id: Date.now(), // Temporary ID for immediate UI update
                    name: file.name,
                    status: "pending",
                    url: publicUrlData?.publicUrl || "",
                    project_id: project.id, // Ensure project_id is available
                  },
                ],
              })),
            }
          : client
      )
    );

    // Also, insert the document record into the database
    const clientToUpdate = clients.find((c) => c.id === selectedClient);
    if (clientToUpdate && clientToUpdate.projects && clientToUpdate.projects.length > 0) {
      const project = clientToUpdate.projects[0]; // Just take the first project for now
      const { error: insertError } = await supabase
        .from('project_documents')
        .insert([{
          project_id: project.id,
          name: file.name,
          url: publicUrlData?.publicUrl || "",
          date: new Date().toISOString().split("T")[0],
          // ...other fields as needed
        }]);

      if (insertError) {
        toaster.create({ description: `Failed to record document in database: ${insertError.message}`, type: "error" });
        // Optionally, revert the UI state change if DB insert fails
      }
    }

    toaster.create({
      description: `Uploaded "${file.name}" for ${clientToUpdate?.full_name || "selected client"}`,
      type: "success",
    });

    // Refresh clients to get actual document IDs and ensure data consistency
    fetchAssignedClients();
  };

  // Schedule handler (simple prompt for demo)
  const handleSchedule = () => {
    const title = prompt("Event title:");
    if (!title) return;
    const date = prompt("Event date (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    if (!date) return;
    setClients((prev) =>
      prev.map((client) =>
        client.id === selectedClient
          ? {
              ...client,
              projects: client.projects.map((project) => ({
                ...project,
                events: [
                  ...(project.events || []),
                  { title, date },
                ],
              })),
            }
          : client
      )
    );
    toaster.create({
      description: `Scheduled "${title}" on ${date}`,
      type: "success",
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
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Left Column - Client List */}
          <VStack spacing={4} align="stretch">
            {clients.map((client) => (
              <Card.Root
                key={client.id}
                p={4}
                onClick={() => setSelectedClient(client.id)}
                cursor="pointer"
                bg={selectedClient === client.id ? "gray.50" : "white"}
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
                  {client.projects?.[0] && (
                    <Badge
                      colorScheme={
                        client.projects[0].progress >= 75
                          ? "green"
                          : client.projects[0].progress >= 50
                            ? "yellow"
                            : "orange"
                      }
                    >
                      {client.projects[0].progress}% Complete
                    </Badge>
                  )}
                </Flex>
                {/* Quick Actions */}
                <HStack mt={4} spacing={4}>
                  <Button
                    size="sm"
                    leftIcon={<Upload size={16} />}
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    Upload
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<CalendarIcon size={16} />}
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSchedule();
                    }}
                  >
                    Schedule
                  </Button>
                </HStack>
              </Card.Root>
            ))}
          </VStack>

          {/* Right Column - Details */}
          <VStack spacing={8} align="stretch">
            {selectedClient ? (
              <>
                {/* Document Upload Section */}
                <Card.Root p={6}>
                  <Heading size="md" mb={6}>
                    Documents
                  </Heading>
                  <Box
                    borderWidth={2}
                    borderRadius="lg"
                    borderStyle="dashed"
                    p={8}
                    textAlign="center"
                    bg="gray.50"
                    mb={6}
                    onClick={() => fileInputRef.current.click()} // Make the dashed box clickable for upload
                    cursor="pointer"
                  >
                    <Icon as={FileText} w={8} h={8} color="gray.400" mb={4} />
                    <Text mb={4}>
                      Drag and drop files here, or click to select files
                    </Text>
                    <Button size="sm" variant="outline">
                      Select Files
                    </Button>
                  </Box>
                  {/* Document List */}
                  <VStack align="stretch" spacing={3}>
                    {getDocumentsForSelectedClient().map((doc) => (
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
                          {doc.url ? (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                          ) : (
                            <Text>{doc.name}</Text>
                          )}
                        </HStack>
                        <HStack>
                          <Badge
                            colorScheme={doc.status === "approved" ? "green" : "yellow"}
                          >
                            {doc.status || "pending"}
                          </Badge>
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={async () => {
                              // Extract the file path from the URL or save it in your doc object
                              const filePath = doc.url
                                ? decodeURIComponent(new URL(doc.url).pathname.replace(/^\/storage\/v1\/object\/public\/project-documents\//, ''))
                                : null;

                              if (!filePath) {
                                toaster.create({ description: "File path not found for deletion", type: "error" });
                                return;
                              }

                              // First, remove from Supabase Storage
                              const { error: storageError } = await supabase.storage
                                .from('project-documents')
                                .remove([filePath]);

                              if (storageError) {
                                toaster.create({ description: `File deletion from storage failed: ${storageError.message}`, type: "error" });
                                return;
                              }

                              // Then, delete the document record from the database
                              const { error: dbError } = await supabase
                                .from('project_documents')
                                .delete()
                                .eq('id', doc.id);

                              if (dbError) {
                                toaster.create({ description: `Database record deletion failed: ${dbError.message}`, type: "error" });
                                return; // Stop if database deletion fails
                              }

                              toaster.create({ description: "File and record deleted successfully", type: "success" });
                              // Refresh clients to reflect the deletion
                              fetchAssignedClients();
                            }}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Flex>
                    ))}
                    {getDocumentsForSelectedClient().length === 0 && (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No documents available
                      </Text>
                    )}
                  </VStack>
                </Card.Root>

                {/* Calendar Section */}
                <Card.Root p={6}>
                  <Heading size="md" mb={6}>
                    Schedule
                  </Heading>
                  <Box className="custom-calendar">
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      tileContent={({ date }) => {
                        const events = getEventsForDate(date);
                        return events.length > 0 ? (
                          <Box
                            w="6px"
                            h="6px"
                            bg="blue.500"
                            borderRadius="full"
                            mx="auto"
                            mt="1"
                          />
                        ) : null;
                      }}
                    />
                  </Box>
                  {/* Events List */}
                  <Box mt={4}>
                    <Text fontWeight="bold" mb={2}>
                      Events for {selectedDate.toDateString()}
                    </Text>
                    {getEventsForDate(selectedDate).length > 0 ? (
                      <VStack align="stretch" spacing={2}>
                        {getEventsForDate(selectedDate).map((event, idx) => (
                          <HStack
                            key={idx}
                            p={2}
                            borderWidth="1px"
                            borderRadius="md"
                          >
                            <Clock size={16} />
                            <Text fontSize="sm">{event.title}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        No events scheduled
                      </Text>
                    )}
                  </Box>
                </Card.Root>
              </>
            ) : (
              <Box
                p={8}
                borderWidth="1px"
                borderRadius="lg"
                textAlign="center"
                color="gray.500"
              >
                <Text>Select a client to view details</Text>
              </Box>
            )}
          </VStack>
        </SimpleGrid>
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