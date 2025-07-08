"use client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
import { useAuthStore } from "@/store/useAuthStore"; 
import supabase from "@/utils/supabaseClient";

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/get-project-details";

const statusIconMap = {
  completed: Check,
  pending: Package,
  in_progress: Ship,
  default: Construction,
};

const MyProjects = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const jwt = useAuthStore((state) => state.token); // Get JWT from store
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileUploads, setFileUploads] = useState([]);
  const [filter, setFilter] = useState("All");
  const [timelines, setTimelines] = useState([]);
  const [agentName, setAgentName] = useState(""); // For agent name

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      if (!jwt || !id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${EDGE_URL}?id=${id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        setProject(data.project || null);
        // Fetch agent name if agent_id exists
        if (data.project?.agent_id) {
          const { data: agentData, error: agentError } = await supabase
            .from("users")
            .select("name")
            .eq("id", data.project.agent_id)
            .single();
          if (!agentError && agentData && agentData.name) {
            setAgentName(agentData.name);
          } else {
            setAgentName("Makao Agent");
          }
        } else {
          setAgentName("Makao Agent");
        }
      } catch (error) {
        setProject(null);
        setAgentName("Makao Agent");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, jwt]);

  // Fetch timelines from Supabase
  useEffect(() => {
    async function fetchTimelines() {
      if (!id) return;
      const { data, error } = await supabase
        .from("project_timelines")
        .select("*")
        .eq("project_id", id)
        .order("date", { ascending: true });
      if (!error) setTimelines(data || []);
    }
    fetchTimelines();
  }, [id]);

  const uniquePhases = Array.from(new Set(timelines.map(t => t.title))).filter(Boolean);

  const filteredMilestones =
    filter === "All"
      ? timelines
      : timelines.filter((milestone) =>
          milestone.title && milestone.title.toLowerCase().includes(filter.toLowerCase())
        );

  if (loading) {
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

  if (!project) {
    return (
      <VStack spacing={4} align="center" justify="center" minH="300px">
        <Text fontSize="lg" color="red.500">
          Project not found
        </Text>
        <Button
          onClick={() => navigate("/dashboard/myprojects")}
          colorScheme="blue"
          size="sm"
        >
          Back to My Projects
        </Button>
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
            alt={project.name}
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
              {project.location || "No location specified"}
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
                      {uniquePhases.map((phase) => (
                        <Button
                          key={phase}
                          size="sm"
                          variant={filter === phase ? "solid" : "outline"}
                          onClick={() => setFilter(phase)}
                          mr={2}
                        >
                          {phase}
                        </Button>
                      ))}
                    </Box>
                    {/* Timeline Content */}
                    <Timeline.Root>
                      {filteredMilestones.map((milestone) => {
                        const IconComponent = statusIconMap[milestone.status] || statusIconMap.default;
                        return (
                          <Timeline.Item key={milestone.id}>
                            <Timeline.Connector>
                              <Timeline.Separator />
                              <Timeline.Indicator>
                                <IconComponent />
                              </Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content>
                              <Timeline.Title>{milestone.title}</Timeline.Title>
                              <Timeline.Description>{milestone.date}</Timeline.Description>
                              <Text textStyle="sm">{milestone.description}</Text>
                            </Timeline.Content>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline.Root>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
        <Box maxH="300px" overflowY="auto" pr={2}>
          <Timeline.Root>
            {timelines.map((milestone) => {
              const IconComponent = statusIconMap[milestone.status] || statusIconMap.default;
              return (
                <Timeline.Item key={milestone.id}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>
                      <IconComponent />
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>{milestone.title}</Timeline.Title>
                    <Timeline.Description>{milestone.date}</Timeline.Description>
                    <Text textStyle="sm">{milestone.description}</Text>
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline.Root>
        </Box>
      </Box>

      {/* Agent Section Only */}
      <Flex w="100%" gap={4} flexDirection={{ base: "column", md: "row" }}>
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
            Personnel Details
          </Heading>
          {/* Makao Agent Section */}
          <Box mt={6} textAlign="center">
            <Avatar.Root>
              <Avatar.Fallback name={agentName || "Makao Agent"} />
              <Avatar.Image src="https://via.placeholder.com/150" />
            </Avatar.Root>
            <Text fontSize="lg" fontWeight="bold" mt={4}>
              {agentName || "Makao Agent"}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Current Agent
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