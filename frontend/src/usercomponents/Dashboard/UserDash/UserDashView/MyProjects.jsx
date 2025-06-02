"use client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Heading,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  Image,
  Timeline,
  Stack,
  CloseButton,
  Dialog,
  Portal,
  ProgressCircle,
} from "@chakra-ui/react";
import { ChevronRight, FileText, Construction, Check, Package, Ship } from "lucide-react";

const MyProjects = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fileUploads, setFileUploads] = useState([]);
  const [filter, setFilter] = useState("All");

  // Demo events for the calendar
  const events = {
    "2025-05-07": ["Team meeting at 10:00 AM", "Review design documents"],
    "2025-05-08": ["Submit project proposal", "Client feedback session"],
  };

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(selectedDate);
  const eventList = events[formattedDate] || null;

  // Simulate fetching project data based on the ID
  useEffect(() => {
    const projects = [
      { id: 1, name: "Residential Casa du Panel", description: "A modern residential project." },
      { id: 2, name: "Urban Skyline Apartments", description: "Luxury apartments in the city." },
    ];
    // Convert both to string for comparison
    const selectedProject = projects.find((p) => String(p.id) === String(id));
    setProject(selectedProject);
  }, [id]);

  // Demo milestones
  const milestonesData = [
    {
      id: 1,
      phase: "Phase 1 Started",
      date: "21st February 2023",
      description: "Initial phase of the project began with planning and design.",
      icon: Ship,
    },
    {
      id: 2,
      phase: "Phase 1 Completed",
      date: "4th April 2023",
      description: "Phase 1 completed with 70% progress achieved.",
      icon: Check,
    },
    {
      id: 3,
      phase: "Next Phase Preparation",
      date: "Ongoing",
      description: "Preparing for the next phase of the project.",
      icon: Package,
    },
  ];

  const filteredMilestones =
    filter === "All"
      ? milestonesData
      : milestonesData.filter((milestone) =>
          milestone.phase.toLowerCase().includes(filter.toLowerCase())
        );

  if (!project) {
    return (
      <VStack spacing={4} align="center" justify="center" minH="300px">
        <ProgressCircle.Root value={null} size="md" aria-label="Loading project details">
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <Text>Loading project details...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch" >
      {/* Breadcrumb */}
      <Breadcrumb.Root mb={2}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link 
            href="/dashboard/myprojects" >My Projects
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>
            {project.name}
            </Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <Heading>{project.name}</Heading>
      <Text>{project.description}</Text>

      {/* Project Card */}
      <Box>
        <Card.Root w="100%" position="relative" mt={10} borderRadius="lg" overflow="hidden">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            alt="Residential Casa du Panel"
            objectFit="cover"
            w="100%"
            h="300px"
          />
          <Box
            p={6}
            position="absolute"
            bottom="0"
            left="0"
            color="white"
            bg="rgba(0, 0, 0, 0.6)"
            w="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            borderBottomRadius="lg"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {project.name}
            </Text>
            <Text fontSize="md" color="gray.300" mb={4}>
              Madrid, Lisbon
            </Text>
            <Stack direction="row" spacing={2} mb={4}>
              <Badge colorPalette="green" fontSize="sm">
                <Construction />
                Ongoing
              </Badge>
              <Badge colorPalette="blue" fontSize="sm">
                <Check />
                On Track
              </Badge>
            </Stack>
          </Box>
        </Card.Root>
      </Box>

      {/* Milestones Section */}
      <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" mb={6} mt={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="xl">Milestones</Heading>
          <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm">
                View Full Timeline
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Project Timeline</Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    {/* Filter Buttons */}
                    <Box mb={4}>
                      <Button
                        size="sm"
                        variant={filter === "All" ? "solid" : "outline"}
                        onClick={() => setFilter("All")}
                        mr={2}
                      >
                        All
                      </Button>
                      <Button
                        size="sm"
                        variant={filter === "Phase 1" ? "solid" : "outline"}
                        onClick={() => setFilter("Phase 1")}
                      >
                        Phase 1
                      </Button>
                    </Box>
                    {/* Timeline Content */}
                    <Timeline.Root>
                      {filteredMilestones.map((milestone) => (
                        <Timeline.Item key={milestone.id}>
                          <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator>
                              <milestone.icon />
                            </Timeline.Indicator>
                          </Timeline.Connector>
                          <Timeline.Content>
                            <Timeline.Title>{milestone.phase}</Timeline.Title>
                            <Timeline.Description>{milestone.date}</Timeline.Description>
                            <Text textStyle="sm">{milestone.description}</Text>
                          </Timeline.Content>
                        </Timeline.Item>
                      ))}
                    </Timeline.Root>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
        <Box maxH="300px" overflowY="auto" pr={2}>
          <Timeline.Root>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <Ship />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>Phase 1 Started</Timeline.Title>
                <Timeline.Description>21st February 2023</Timeline.Description>
                <Text textStyle="sm">
                  Initial phase of the project began with planning and design.
                </Text>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <Check />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>Phase 1 Completed</Timeline.Title>
                <Timeline.Description>4th April 2023</Timeline.Description>
                <Text textStyle="sm">
                  Phase 1 completed with 70% progress achieved.
                </Text>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <Package />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>Next Phase Preparation</Timeline.Title>
                <Timeline.Description>Ongoing</Timeline.Description>
                <Text textStyle="sm">
                  Preparing for the next phase of the project.
                </Text>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline.Root>
        </Box>
      </Box>

      {/* Timeline Section */}
      <Flex w="100%" gap={4} flexDirection={{ base: "column", md: "row" }}>
        {/* Main Box (80% width) */}
        <Box w={{ base: "100%", md: "80%" }} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Heading size="xl" mb={4}>
            Timeline
          </Heading>
          <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
            {/* Calendar on the left */}
            <Box w={{ base: "100%", md: "45%" }} fontFamily={"Arial, sans-serif"}>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date }) => {
                  const formatted = formatDate(date);
                  return events[formatted] ? (
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
            {/* Event Display on the right */}
            <Box
              w={{ base: "100%", md: "90%" }}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="gray.50"
            >
              {selectedDate ? (
                eventList ? (
                  <VStack spacing={2}>
                    {eventList.map((event, index) => (
                      <Text key={index} fontSize="sm">
                        {event}
                      </Text>
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    No event on this day
                  </Text>
                )
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Select a date to view content
                </Text>
              )}
            </Box>
          </Flex>
        </Box>

        {/* Contracting Company Section */}
        <Box
          w={{ base: "100%", md: "20%" }}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Personelle Details
          </Heading>
          {/* Company Avatar */}
          <Avatar.Root>
            <Avatar.Fallback name="Metano Construction" />
            <Avatar.Image src="https://via.placeholder.com/150" />
          </Avatar.Root>
          <Text fontSize="lg" fontWeight="bold" mt={4}>
            Metano Construction
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            Current Contractor
          </Text>
          {/* Makao Agent Section */}
          <Box mt={6} textAlign="center">
            <Avatar.Root>
              <Avatar.Fallback name="Makao Agent" />
              <Avatar.Image src="https://via.placeholder.com/150" />
            </Avatar.Root>
            <Text fontSize="lg" fontWeight="bold" mt={4}>
              Jane Smith
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Agent ID: 123456
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* File Uploads Section */}
      <Box>
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="xl">Project Documents</Heading>
          </Flex>
          {fileUploads.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {fileUploads.map((file) => (
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
                  </HStack>
                </Box>
              ))}
              <Button
                size="sm"
                rightIcon={<ChevronRight size={16} />}
                alignSelf="flex-end"
                onClick={() => {
                  // Add navigation logic here
                  console.log("Navigate to all files");
                }}
              >
                See all files
              </Button>
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No files uploaded yet.
            </Text>
          )}
        </Box>
      </Box>
    </VStack>
  );
};

export default MyProjects;