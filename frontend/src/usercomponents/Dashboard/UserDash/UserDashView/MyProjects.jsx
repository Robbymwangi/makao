"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
  Button,
  Heading,
  List,
  ListItem,
  Avatar,
  IconButton,
  SimpleGrid,
  Breadcrumb,
  Card,
  Image,
  Timeline,
  Stack,
} from "@chakra-ui/react";
import { ChevronRight, FileText, Plus, Construction, Check } from "lucide-react";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";

const MyProjects = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [fileUploads, setFileUploads] = useState([]);
  const [dayActivities, setDayActivities] = useState([]);

  // Simulated events
  const events = {
    "2025-05-07": ["Team meeting at 10:00 AM", "Review design documents"],
    "2025-05-08": ["Submit project proposal", "Client feedback session"],
  };

  // Format the selected date to match the keys in the `events` object
  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(selectedDate);
  const eventList = events[formattedDate] || null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setProjects([
          {
            id: 1,
            name: "Residential Casa du Panel",
            locations: ["Madrid", "Lisbon"],
            progress: 65,
          },
        ]);
        setMilestones([
          {
            id: 1,
            phase: "Phase 1",
            startDate: "21/2/23",
            endDate: "4/4/23",
            progress: 70,
          },
        ]);
        setFileUploads([
          {
            id: 1,
            name: "Project Brief",
            date: "1/1/23",
            source: "Metano",
          },
        ]);
        setDayActivities([
          {
            id: 1,
            date: 23,
            activities: ["Team meeting at 10:00 AM", "Review design documents"],
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Section */}
      <Box>
        <Breadcrumb.Root size={"lg"} variant={"underline"}>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">My Projects</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>Milestones</Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <Flex justify="space-between" align="center" mt={4} gap={4} wrap="wrap">
          <VStack align="start" spacing={1} flex="1" minW="0">
            <Text fontSize="2xl" fontWeight="bold">
              My Projects
            </Text>
            <Text fontSize="md" color="gray.500">
              Overview of your projects and milestones
            </Text>
          </VStack>
        </Flex>

        <Card.Root w="100%" position="relative" mt={10} borderRadius="lg" overflow="hidden">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
              Residential Casa du Panel
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
          <Button size="sm">Expand</Button>
        </Flex>
        <Box maxH="300px" overflowY="auto" pr={2}>
          <Timeline.Root>
            <Timeline.Item>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <LuShip />
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
                  <LuCheck />
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
                  <LuPackage />
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
              w={{ base: "100%", md: "60%" }}
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
            <Avatar.Image src="https://via.placeholder.com/150" /> {/* Replace with actual company logo */}
          </Avatar.Root>

          {/* Company and Agent Details */}
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
              <Avatar.Image src="https://via.placeholder.com/150" /> {/* Replace with actual agent image */}
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
            <Heading size="xl">File Uploads</Heading>
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