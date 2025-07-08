import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Spinner,
  SimpleGrid,
  Stat,
  HStack,
  Badge,
  Avatar,
  Button,
  useBreakpointValue,
  Menu,
  Portal,
} from "@chakra-ui/react";
import {
  Users,
  FileText,
  Calendar as CalendarIcon,
  Bell,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Plus,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import supabase from "@/utils/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

const AgentAdminHome = () => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("all");

  // Get the current user from your auth store
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("agents")
        .select("name, role")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setAgent(data);
      }
      setLoading(false);
    };
    fetchAgent();
  }, [user]);

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
        return <Bell size={16} color="orange" />;
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
          Agent Administration
        </Heading>
      </Flex>
      <VStack spacing={4} align="start">
        {loading ? (
          <Spinner />
        ) : agent ? (
          <Text
            fontSize="2xl"
            color="gray.700"
            fontWeight="medium"
            fontFamily="'Playfair Display', serif"
            lineHeight="tall"
            bg="gray.50"
            px={5}
            py={3}
            borderRadius="md"
            boxShadow="sm"
          >
            Welcome back,{" "}
            <Text as="span" fontWeight="bold" display="inline">
              {agent.name || "Agent"}
            </Text>
            . You are logged in as:{" "}
            <Text as="span" fontWeight="bold" display="inline">
              {agent.role}
            </Text>
          </Text>
        ) : (
          <Text fontSize="lg" color="red.500">
            Agent details not found.
          </Text>
        )}
      </VStack>
      {/* Everything else is commented out */}
      {/*
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        ...
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        ...
      </SimpleGrid>
      */}
    </Box>
  );
};

export default AgentAdminHome;
