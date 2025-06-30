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
  UserCog,
  Shield,
  TicketCheck,
  AlertTriangle,
  ChevronRight,
  Plus,
  MessageSquare,
  Settings,
  Key,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router";

const SystemAdminHome = () => {
  const navigate = useNavigate();
  
  // Stats for the dashboard
  const stats = [
    {
      icon: <Users size={20} />,
      label: "Total Users",
      value: "1,234",
      help: "85 new this month",
      color: "blue.500",
    },
    {
      icon: <Shield size={20} />,
      label: "Staff Members",
      value: "48",
      help: "12 agents, 36 consultants",
      color: "purple.500",
    },
    {
      icon: <TicketCheck size={20} />,
      label: "Active Tickets",
      value: "23",
      help: "8 require attention",
      color: "orange.500",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Support Messages",
      value: "15",
      help: "3 unread",
      color: "green.500",
    },
  ];

  // Recent activities in the system
  const recentActivities = [
    {
      id: 1,
      type: "user",
      title: "New User Registration",
      user: "John Smith",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "staff",
      title: "Role Assignment",
      user: "Sarah Johnson",
      time: "4 hours ago",
      status: "pending",
    },
    {
      id: 3,
      type: "ticket",
      title: "System Access Issue",
      user: "Tech Support",
      time: "1 day ago",
      status: "urgent",
    },
  ];

  // Staff management overview
  const staffOverview = [
    {
      id: 1,
      name: "Jane Doe",
      role: "Agent",
      status: "Active",
      avatar: "https://bit.ly/jane-doe",
    },
    {
      id: 2,
      name: "Mike Wilson",
      role: "Consultant",
      status: "Active",
      avatar: "https://bit.ly/mike-wilson",
    },
    {
      id: 3,
      name: "Alice Brown",
      role: "Agent",
      status: "Pending",
      avatar: "https://bit.ly/alice-brown",
    },
  ];

  // Support tickets overview
  const supportTickets = [
    {
      id: 1,
      title: "System Access Issue",
      reporter: "John Smith",
      priority: "high",
      category: "System",
    },
    {
      id: 2,
      title: "Password Reset Request",
      reporter: "Sarah Wilson",
      priority: "medium",
      category: "User",
    },
    {
      id: 3,
      title: "Agent Assignment Request",
      reporter: "Mike Johnson",
      priority: "low",
      category: "Agent",
    },
  ];

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
          System Administration
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
                  <Menu.Item onClick={() => navigate("/admin-dashboard/user-management/new")}>
                    Create New User
                  </Menu.Item>
                  <Menu.Item onClick={() => navigate("/admin-dashboard/staff-management/new")}>
                    Add Staff Member
                  </Menu.Item>
                  <Menu.Item onClick={() => navigate("/admin-dashboard/support-tools/new-ticket")}>
                    Open Support Ticket
                  </Menu.Item>
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
          {/* Staff Management Section */}
          <Card.Root p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md">Staff Overview</Heading>
              <Button
                variant="ghost"
                rightIcon={<ChevronRight size={16} />}
                size="sm"
                onClick={() => navigate("/admin-dashboard/staff-management")}
              >
                Manage Staff
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {staffOverview.map((staff) => (
                <Flex
                  key={staff.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  align="center"
                  justify="space-between"
                  _hover={{ bg: "gray.50" }}
                >
                  <HStack spacing={4}>
                    <Avatar.Root>
                      <Avatar.Image src={staff.avatar} />
                      <Avatar.Fallback name={staff.name} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="bold">{staff.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {staff.role}
                      </Text>
                    </Box>
                  </HStack>
                  <Badge
                    colorScheme={staff.status === "Active" ? "green" : "orange"}
                  >
                    {staff.status}
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
                      {activity.type === "user" ? (
                        <Users size={16} />
                      ) : activity.type === "staff" ? (
                        <UserCog size={16} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Flex justify="space-between" align="start">
                      <Box>
                        <Timeline.Title>{activity.title}</Timeline.Title>
                        <Timeline.Description>
                          {activity.user} • {activity.time}
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
          {/* Quick Actions Section */}
          <Card.Root p={6}>
            <Heading size="md" mb={6}>
              Administrative Tools
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
                onClick={() => navigate("/admin-dashboard/user-management")}
              >
                <Users size={24} />
                <Text>User Management</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
                onClick={() => navigate("/admin-dashboard/staff-management")}
              >
                <UserCog size={24} />
                <Text>Staff Directory</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
                onClick={() => navigate("/admin-dashboard/support-tools")}
              >
                <Settings size={24} />
                <Text>Support Tools</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
                onClick={() => navigate("/admin-dashboard/messages")}
              >
                <MessageSquare size={24} />
                <Text>Support Messages</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
                onClick={() => navigate("/admin-dashboard/user-management/reset-password")}
              >
                <Key size={24} />
                <Text>Reset Passwords</Text>
              </Button>
              <Button
                height="100px"
                variant="outline"
                flexDirection="column"
                gap={2}
                onClick={() => navigate("/admin-dashboard/user-management/assign-agent")}
              >
                <UserPlus size={24} />
                <Text>Assign Agent</Text>
              </Button>
            </SimpleGrid>
          </Card.Root>

          {/* Support Tickets Overview */}
          <Card.Root p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md">Support Tickets</Heading>
              <Button
                variant="ghost"
                rightIcon={<ChevronRight size={16} />}
                size="sm"
                onClick={() => navigate("/admin-dashboard/support-tools")}
              >
                View All
              </Button>
            </Flex>
            <VStack spacing={4} align="stretch">
              {supportTickets.map((ticket) => (
                <Box key={ticket.id} p={4} borderWidth="1px" borderRadius="lg">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{ticket.title}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Reported by: {ticket.reporter}
                      </Text>
                    </VStack>
                    <HStack spacing={2}>
                      <Badge colorScheme={ticket.category === "System" ? "purple" : ticket.category === "User" ? "blue" : "green"}>
                        {ticket.category}
                      </Badge>
                      <Badge 
                        colorScheme={
                          ticket.priority === "high" 
                            ? "red" 
                            : ticket.priority === "medium" 
                            ? "yellow" 
                            : "green"
                        }
                      >
                        {ticket.priority} Priority
                      </Badge>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Card.Root>
  </VStack>
      </SimpleGrid>
    </Box>
);
};

export default SystemAdminHome;
