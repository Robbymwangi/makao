import React, { useState, useEffect } from "react";
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
import supabase from "@/utils/supabaseClient"; // Make sure this is your initialized Supabase client

const EDGE_FUNCTION_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/get-assigned-clients";

const AssignedClients = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchAssignedClients = async () => {
      // Always get the latest session from Supabase client
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        const agentId = user.id;
        const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        console.log("Fetching clients for agent ID:", agentId);
        console.log("Using auth header:", authHeader.substring(0, 15) + "...");

        const res = await fetch(`${EDGE_FUNCTION_URL}?agent_id=${agentId}`, {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("API Error:", data);
          throw new Error(data.error || "Failed to fetch clients");
        }

        setClients(data);
        if (data.length > 0) setSelectedClient(data[0].id);
      } catch (err) {
        console.log("Error fetching clients:", err);
        toaster.create({
          title: "Error",
          description: err.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedClients();
  }, [user]);

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
        <HStack spacing={4} mt={{ base: 4, md: 0 }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" leftIcon={<Plus size={16} />}>
                Add New Client
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item>Import from CSV</Menu.Item>
                  <Menu.Item>Manual Entry</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      </Flex>

      {clients.length === 0 ? (
        <Box p={8} borderWidth="1px" borderRadius="lg" textAlign="center">
          <Text fontSize="lg">No clients assigned yet.</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            {user?.email && `Logged in as: ${user.email}`}
          </Text>
          <Button
            mt={4}
            colorScheme="blue"
            leftIcon={<Plus size={16} />}
            onClick={() =>
              toaster.create({
                description: "Add client functionality coming soon.",
                type: "info",
              })
            }
          >
            Add Your First Client
          </Button>
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
                      toaster.create({
                        description: "Upload functionality coming soon.",
                        type: "info",
                      });
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
                      toaster.create({
                        description: "Schedule functionality coming soon.",
                        type: "info",
                      });
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
                          <Text>{doc.name}</Text>
                        </HStack>
                        <Badge
                          colorScheme={doc.status === "approved" ? "green" : "yellow"}
                        >
                          {doc.status || "pending"}
                        </Badge>
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
    </Box>
  );
};

export default AssignedClients;