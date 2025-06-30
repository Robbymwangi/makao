import React, { useState } from "react";
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

const AssignedClients = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for clients
  const clients = [
    {
      id: 1,
      name: "John Doe",
      project: "Residential Casa",
      progress: 75,
      avatar: "https://bit.ly/dan-abramov",
      documents: [
        { id: 1, name: "Building Permit", type: "permit", status: "approved" },
        { id: 2, name: "Floor Plans", type: "blueprint", status: "pending" },
      ],
      events: [
        { date: "2024-03-20", title: "Site Visit" },
        { date: "2024-03-21", title: "Document Review" },
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      project: "Urban Apartments",
      progress: 45,
      avatar: "https://bit.ly/ryan-florence",
      documents: [
        { id: 3, name: "Contract", type: "legal", status: "pending" },
      ],
      events: [
        { date: "2024-03-22", title: "Client Meeting" },
      ],
    },
  ];

  // Get events for selected date
  const getEventsForDate = (date) => {
    if (!selectedClient) return [];
    const client = clients.find(c => c.id === selectedClient);
    if (!client) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return client.events.filter(event => event.date === dateStr);
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
                    <Avatar.Image src={client.avatar} />
                    <Avatar.Fallback name={client.name} />
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="bold">{client.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {client.project}
                    </Text>
                  </Box>
                </HStack>
                <Badge
                  colorScheme={
                    client.progress >= 75
                      ? "green"
                      : client.progress >= 50
                      ? "yellow"
                      : "orange"
                  }
                >
                  {client.progress}% Complete
                </Badge>
              </Flex>

              {/* Quick Actions */}
              <HStack mt={4} spacing={4}>
                <Button
                  size="sm"
                  leftIcon={<Upload size={16} />}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle document upload
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
                    // Handle calendar event
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
                  {clients
                    .find((c) => c.id === selectedClient)
                    ?.documents.map((doc) => (
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
                          colorScheme={
                            doc.status === "approved" ? "green" : "yellow"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </Flex>
                    ))}
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
    </Box>
  );
};

export default AssignedClients;