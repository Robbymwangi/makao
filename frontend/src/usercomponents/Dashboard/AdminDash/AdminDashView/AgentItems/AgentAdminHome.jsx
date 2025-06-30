import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  HStack,
  VStack,
  Text,
  Flex,
  Badge,
  Avatar,
  Button,
  Heading,
  useBreakpointValue,
  Menu,
  Portal,
  Timeline,
  Card,
} from "@chakra-ui/react";
import {
  Users,
  FileText,
  Calendar as CalendarIcon,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Plus,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AgentAdminHome = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data for stats
  const stats = [
    {
      icon: <Users size={20} />,
      label: "Active Clients",
      value: "12",
      help: "2 new this month",
    color: "blue.500",
  },
  {
      icon: <FileText size={20} />,
      label: "Pending Documents",
      value: "8",
      help: "3 urgent",
      color: "orange.500",
    },
    {
      icon: <CalendarIcon size={20} />,
      label: "Today's Events",
      value: "4",
      help: "Next: Client Meeting 2PM",
    color: "green.500",
  },
  {
      icon: <Bell size={20} />,
      label: "Notifications",
      value: "6",
      help: "2 require action",
    color: "purple.500",
  },
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: "document",
      title: "Building Permit Approved",
      client: "John Doe",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "meeting",
      title: "Site Inspection Scheduled",
      client: "Sarah Smith",
      time: "4 hours ago",
      status: "pending",
    },
    {
      id: 3,
      type: "alert",
      title: "Document Upload Required",
      client: "Mike Johnson",
      time: "1 day ago",
      status: "urgent",
    },
  ];

  // Mock data for assigned clients
  const assignedClients = [
    {
      id: 1,
      name: "John Doe",
      project: "Residential Casa",
      progress: 75,
      avatar: "https://bit.ly/dan-abramov",
    },
    {
      id: 2,
      name: "Sarah Smith",
      project: "Urban Apartments",
      progress: 45,
      avatar: "https://bit.ly/ryan-florence",
    },
    {
      id: 3,
      name: "Mike Johnson",
      project: "Commercial Complex",
      progress: 90,
      avatar: "https://bit.ly/prosper-baba",
    },
  ];

  // Calendar events
  const events = {
    "2024-03-20": ["Client Meeting - John Doe", "Site Inspection"],
    "2024-03-21": ["Document Deadline", "Team Sync"],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="green" />;
      case "pending":
        return <Clock size={16} color="orange" />;
      case "urgent":
        return <AlertTriangle size={16} color="red" />;
      default:
        return null;
    }
  };

  return (
    <Box p={6}>
      {/* Header Section */}
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
          Agent Dashboard
        </Heading>
        <HStack spacing={4} mt={{ base: 4, md: 0 }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" leftIcon={<Plus size={16} />}>
                Quick Actions
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item>Add New Client</Menu.Item>
                  <Menu.Item>Schedule Meeting</Menu.Item>
                  <Menu.Item>Upload Document</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat) => (
          <Stat.Root
            key={stat.label}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            bg="white"
            _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
            transition="all 0.2s"
          >
            <HStack spacing={4}>
              <Box p={2} bg={stat.color} borderRadius="lg" color="white">
                {stat.icon}
              </Box>
              <Box>
                <Stat.Label fontSize="sm" color="gray.500">
                  {stat.label}
                </Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold">
                  {stat.value}
                </Stat.ValueText>
                <Stat.HelpText fontSize="xs">{stat.help}</Stat.HelpText>
              </Box>
            </HStack>
          </Stat.Root>
        ))}
      </SimpleGrid>

      {/* Main Content Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Left Column */}
        <VStack spacing={8} align="stretch">
          {/* Assigned Clients Section */}
          <Card.Root p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md">Assigned Clients</Heading>
              <Button
                variant="ghost"
                rightIcon={<ChevronRight size={16} />}
                size="sm"
              >
                View All
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {assignedClients.map((client) => (
                <Flex
                  key={client.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  align="center"
                  justify="space-between"
                  _hover={{ bg: "gray.50" }}
                >
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
              ))}
            </VStack>
          </Card.Root>

          {/* Recent Activities Section */}
          <Card.Root p={6}>
            <Heading size="md" mb={6}>
              Recent Activities
            </Heading>
            <Timeline.Root>
              {recentActivities.map((activity) => (
                <Timeline.Item key={activity.id}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>
                      {getStatusIcon(activity.status)}
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Flex justify="space-between" align="start">
                      <Box>
                        <Timeline.Title>{activity.title}</Timeline.Title>
                        <Timeline.Description>
                          {activity.client} • {activity.time}
                        </Timeline.Description>
                      </Box>
                      <Badge
                        colorScheme={
                          activity.status === "completed"
                            ? "green"
                            : activity.status === "urgent"
                            ? "red"
                            : "yellow"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </Flex>
                  </Timeline.Content>
                </Timeline.Item>
              ))}
            </Timeline.Root>
          </Card.Root>
        </VStack>

        {/* Right Column */}
        <VStack spacing={8} align="stretch">
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
                  const formattedDate = date.toISOString().split("T")[0];
                  return events[formattedDate] ? (
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
            {/* Selected Date Events */}
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>
                Events for {selectedDate.toDateString()}
              </Text>
              {events[selectedDate.toISOString().split("T")[0]] ? (
                events[selectedDate.toISOString().split("T")[0]].map(
                  (event, index) => (
                    <Text key={index} fontSize="sm" color="gray.600">
                      • {event}
                    </Text>
                  )
                )
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No events scheduled
                </Text>
              )}
            </Box>
          </Card.Root>

          {/* Quick Actions Section */}
          <Card.Root p={6}>
            <Heading size="md" mb={6}>
              Quick Actions
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
              >
                <FileText size={24} />
                <Text>Upload Documents</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
              >
                <CalendarIcon size={24} />
                <Text>Schedule Meeting</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
              >
                <Users size={24} />
                <Text>Add Client</Text>
              </Button>
            <Button
                height="100px"
              variant="outline"
                flexDirection="column"
                gap={2}
            >
                <Bell size={24} />
                <Text>View Notifications</Text>
            </Button>
            </SimpleGrid>
          </Card.Root>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default AgentAdminHome;
