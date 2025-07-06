import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Badge,
  Button,
  Card,
  SimpleGrid,
  Flex,
  Icon,
  useBreakpointValue,
  Menu,
  Portal,
} from "@chakra-ui/react";
import {
  Calendar as CalendarIcon,
  Upload,
  FileText,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import supabase from "../../../../../utils/supabaseClient"; // Adjust path if needed

const AssignedClients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState(null);

  // Get the current agent's UUID from Supabase auth
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAgentId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch clients assigned to this agent
  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    fetch(`http://localhost:3000/agents/${agentId}/clients`)
      .then((res) => res.json())
      .then(async (users) => {
        const clientsWithProjects = await Promise.all(
          users.map(async (user) => {
            const projectsRes = await fetch(
              `http://localhost:3000/users/${user.id}/projects`
            );
            const projects = await projectsRes.json();
            return {
              ...user,
              projects,
            };
          })
        );
        setClients(clientsWithProjects);
        setLoading(false);
      })
      .catch(() => {
        setClients([]);
        setLoading(false);
      });
  }, [agentId]);

  // Helper: Get selected client object
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Helper: Get events for selected date (if you add events to your schema)
  const getEventsForDate = (date) => {
    if (!selectedClient) return [];
    let events = [];
    selectedClient.projects?.forEach((project) => {
      if (project.events) {
        events = events.concat(
          project.events.filter(
            (event) => event.date === date.toISOString().split("T")[0]
          )
        );
      }
    });
    return events;
  };

  return (
    <Box p={6}>
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        direction={{ base: "column", md: "row" }}
      >
        <Heading
          size="2xl"
          fontWeight="bold"
          fontFamily="'Playfair Display', serif"
        >
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

      {/* Main Content Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Left Column - Client List */}
        <VStack spacing={4} align="stretch">
          {loading ? (
            <Text>Loading clients...</Text>
          ) : clients.length === 0 ? (
            <Text>No assigned clients found.</Text>
          ) : (
            clients.map((client) => (
              <Card.Root
                key={client.id}
                p={4}
                onClick={() => setSelectedClientId(client.id)}
                cursor="pointer"
                bg={selectedClientId === client.id ? "gray.50" : "white"}
                _hover={{ bg: "gray.50" }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Avatar.Root>
                      <Avatar.Image src={client.avatar || ""} />
                      <Avatar.Fallback name={client.full_name || client.email} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="bold">{client.full_name || client.email}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {client.projects && client.projects.length > 0
                          ? client.projects.map((p) => p.project_name).join(", ")
                          : "No projects"}
                      </Text>
                    </Box>
                  </HStack>
                  <Badge colorScheme="blue">
                    {client.projects ? client.projects.length : 0} Project
                    {client.projects && client.projects.length === 1 ? "" : "s"}
                  </Badge>
                </Flex>
              </Card.Root>
            ))
          )}
        </VStack>

        {/* Right Column - Details */}
        <VStack spacing={8} align="stretch">
          {selectedClient ? (
            <>
              {/* Projects Section */}
              {selectedClient.projects && selectedClient.projects.length > 0 ? (
                selectedClient.projects.map((project) => (
                  <Card.Root p={6} key={project.id} mb={4}>
                    <Heading size="md" mb={4}>
                      {project.project_name}
                    </Heading>
                    <Text mb={2}>Status: {project.status}</Text>
                    <Text mb={2}>Location: {project.location}</Text>
                    <Text mb={2}>Budget: {project.estimated_budget}</Text>
                    {/* Documents */}
                    <Heading size="sm" mt={4} mb={2}>
                      Documents
                    </Heading>
                    <VStack align="stretch" spacing={3}>
                      {project.project_documents && project.project_documents.length > 0 ? (
                        project.project_documents.map((doc) => (
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
                            <Badge colorScheme="green">{doc.status || "uploaded"}</Badge>
                          </Flex>
                        ))
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          No documents uploaded.
                        </Text>
                      )}
                    </VStack>
                  </Card.Root>
                ))
              ) : (
                <Text>No projects for this client.</Text>
              )}

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
    </Box>
  );
};

export default AssignedClients;