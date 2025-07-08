"use client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
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
  const jwt = useAuthStore((state) => state.token);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileUploads, setFileUploads] = useState([]);
  const [filter, setFilter] = useState("All");
  const [timelines, setTimelines] = useState([]);
  const [agentName, setAgentName] = useState(""); // For agent name
  const [agentEmail, setAgentEmail] = useState(""); // For agent email

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

        // Fetch agent name and email via Supabase Edge Function if agent_id exists
        if (data.project?.agent_id) {
          try {
            const { data: agentData, error: agentError } = await supabase.functions.invoke('get-agent-details', {
              body: { client_id: data.project.agent_id }
            });
            if (agentData && agentData.agent) {
              setAgentName(agentData.agent.name || "Makao Agent");
              setAgentEmail(agentData.agent.email || "");
              console.log('Agent name:', agentData.agent.name);
              console.log('Agent email:', agentData.agent.email);
            } else {
              setAgentName("Makao Agent");
              setAgentEmail("");
            }
          } catch {
            setAgentName("Makao Agent");
            setAgentEmail("");
          }
        } else {
          setAgentName("Makao Agent");
          setAgentEmail("");
        }
      } catch (error) {
        setProject(null);
        setAgentName("Makao Agent");
        setAgentEmail("");
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

  // Fetch project documents
  useEffect(() => {
    async function fetchProjectDocuments() {
      if (!id) return;
      // Fetch all document files for this project
      const { data: files, error } = await supabase
        .from("project_files")
        .select("*, uploaded_by")
        .eq("project_id", id)
        .eq("file_category", "document");

      if (!error && files && files.length > 0) {
        // Get unique agent IDs
        const agentIds = [
          ...new Set(files.map(file => file.uploaded_by).filter(Boolean))
        ];
        let agentMap = {};
        if (agentIds.length > 0) {
          // Fetch agent names from the agents table
          const { data: agents } = await supabase
            .from("agents")
            .select("id, name")
            .in("id", agentIds);
          agentMap = (agents || []).reduce((acc, agent) => {
            acc[agent.id] = agent.name;
            return acc;
          }, {});
        }
        setFileUploads(
          files.map(file => ({
            id: file.id,
            name: file.file_name || file.name,
            source: agentMap[file.uploaded_by] || "Unknown",
            date: file.created_at
              ? new Date(file.created_at).toLocaleDateString()
              : "",
          }))
        );
      } else {
        setFileUploads([]);
      }
    }
    fetchProjectDocuments();
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
                              {filter === "All" ? (
                                // All: Only show name, date, description
                                <>
                                  <Timeline.Description>
                                    {milestone.created_at
                                      ? new Date(milestone.created_at).toLocaleDateString()
                                      : milestone.date || "N/A"}
                                  </Timeline.Description>
                                  <Text textStyle="sm">{milestone.description}</Text>
                                </>
                              ) : (
                                // Per-milestone: Show all details
                                <>
                                  <Timeline.Description>
                                    <b>Created:</b>{" "}
                                    {milestone.created_at
                                      ? new Date(milestone.created_at).toLocaleDateString()
                                      : milestone.date || "N/A"}
                                    <br />
                                    {milestone.completed_at && (
                                      <>
                                        <b>Completed:</b>{" "}
                                        {new Date(milestone.completed_at).toLocaleDateString()}
                                        <br />
                                      </>
                                    )}
                                    <b>Estimated Cost:</b>{" "}
                                    {milestone.estimated_cost !== undefined && milestone.estimated_cost !== null
                                      ? `KES ${milestone.estimated_cost.toLocaleString()}`
                                      : "N/A"}
                                    <br />
                                    <b>Total Expenditure:</b>{" "}
                                    {milestone.actual_expenditure !== undefined && milestone.actual_expenditure !== null
                                      ? `KES ${milestone.actual_expenditure.toLocaleString()}`
                                      : "N/A"}
                                  </Timeline.Description>
                                  <Text textStyle="sm">{milestone.description}</Text>
                                </>
                              )}
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