"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Badge,
  Heading,
  useBreakpointValue,
  CloseButton,
  Portal,
  Select,
  Menu,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { createListCollection, Dialog } from "@chakra-ui/react";

const StaffManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [agents, setAgents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'assign', 'remove'
  const [dialogAgent, setDialogAgent] = useState(null);
  const [dialogAdmin, setDialogAdmin] = useState(null);
  const [assignProjects, setAssignProjects] = useState([]);

  const isMobileView = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    // Combine all fetches and set loading to false when all are done
    setLoading(true);
    Promise.all([fetchAdmins(), fetchAgents(), fetchProjects()])
      .finally(() => setLoading(false));
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:3000/admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      toaster.create({
        title: "Error",
        description: "Failed to fetch admins",
        type: "error",
      });
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:3000/agents");
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      toaster.create({
        title: "Error",
        description: "Failed to fetch agents",
        type: "error",
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/projects");
      const data = await res.json();
      setProjects(data);
      setProjectOptions(
        createListCollection({
          items: data.map((p) => ({
            label: p.name,
            value: p.id,
          })),
        })
      );
    } catch (err) {
      toaster.create({
        title: "Error",
        description: "Failed to fetch projects",
        type: "error",
      });
    }
  };

  // Dialog helpers
  const openAssignProjects = (agent) => {
    setDialogAgent(agent);
    // Initialize with existing projects, ensuring it's an array of IDs
    setAssignProjects(agent.projects || []);
    setDialogType("assign");
    setDialogOpen(true);
  };

  const openRemoveAdmin = (admin) => {
    setDialogAdmin(admin);
    setDialogType("remove");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogAgent(null);
      setDialogAdmin(null);
      setAssignProjects([]);
    }, 300);
  };

  // Assign projects to agent
  const handleAssignProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/agents/assign-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: dialogAgent.id,
          project_ids: assignProjects, // This should be an array of project IDs
        }),
      });
      if (!res.ok) throw new Error("Failed to assign projects");
      toaster.create({
        title: "Projects Assigned",
        description: `Assigned projects to ${dialogAgent.name}`,
        type: "success",
      });
      fetchAgents(); // Re-fetch agents to update the UI
      handleCloseDialog();
    } catch (err) {
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  // Remove admin
  const handleRemoveAdmin = async () => {
    try {
      const res = await fetch("http://localhost:3000/admins/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id: dialogAdmin.id }),
      });
      if (!res.ok) throw new Error("Failed to remove admin");
      toaster.create({
        title: "Admin Removed",
        description: `${dialogAdmin.full_name} has been removed.`,
        type: "info",
      });
      fetchAdmins(); // Re-fetch admins to update the UI
      handleCloseDialog();
    } catch (err) {
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      <Toaster />
      <Heading
        size="2xl"
        mb={6}
        fontFamily="'Playfair Display', serif"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }}
      >
        Staff Management
      </Heading>
      <Flex flex="1" gap={4} bg="white" direction={{ base: "column", md: "row" }} overflow="hidden">
        {/* Admins List */}
        <Box flex="1" minW={{ base: "100%", md: "320px" }} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm" overflowY="auto">
          <HStack p={4} borderBottomWidth="1px" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">Admins</Text>
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Stack key={`admin-skeleton-${i}`} p={4} gap={2}>
                  <Skeleton height="20px" width="40%" variant="shine" css={{ "--start-color": "colors.gray.200", "--end-color": "colors.gray.400" }} />
                  <Skeleton height="16px" width="60%" variant="shine" css={{ "--start-color": "colors.gray.200", "--end-color": "colors.gray.400" }} />
                </Stack>
              ))
            ) : admins.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">No admins found.</Text>
            ) : (
              admins.map((admin) => (
                <Box key={admin.id} p={4} _hover={{ bg: "gray.100" }} display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text fontWeight="bold">{admin.full_name}</Text>
                    <Text fontSize="sm" color="gray.500">{admin.email}</Text>
                  </Box>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="xs">Actions</Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openRemoveAdmin(admin); }}>
                            Remove Admin
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        {/* Agents List */}
        <Box flex="1" minW={{ base: "100%", md: "320px" }} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm" overflowY="auto">
          <HStack p={4} borderBottomWidth="1px" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">Agents</Text>
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Stack key={`agent-skeleton-${i}`} p={4} gap={2}>
                  <Skeleton height="20px" width="40%" variant="shine" css={{ "--start-color": "colors.gray.200", "--end-color": "colors.gray.400" }} />
                  <Skeleton height="16px" width="60%" variant="shine" css={{ "--start-color": "colors.gray.200", "--end-color": "colors.gray.400" }} />
                  <Skeleton height="14px" width="30%" variant="shine" css={{ "--start-color": "colors.gray.200", "--end-color": "colors.gray.400" }} />
                </Stack>
              ))
            ) : agents.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">No agents found.</Text>
            ) : (
              agents.map((agent) => (
                <Box key={agent.id} p={4} _hover={{ bg: "gray.100" }} display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text fontWeight="bold">{agent.name}</Text>
                    <Text fontSize="sm" color="gray.500">{agent.email}</Text>
                    <HStack fontSize="xs" color="gray.400" mt={1}>
                      <Text>Projects:</Text>
                      {(agent.projects || []).map((pid) => {
                        const project = projects.find((p) => p.id === pid);
                        return (
                          <Badge key={pid} colorScheme="green">
                            {project ? project.name : pid}
                          </Badge>
                        );
                      })}
                    </HStack>
                  </Box>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="xs">Actions</Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openAssignProjects(agent); }}>
                            Assign/Remove Projects
                          </Menu.Item>
                          {/* Add a specific handler for agent removal if different from admin removal */}
                          <Menu.Item onClick={(e) => { e.stopPropagation(); /* openRemoveAgent(agent); */ }}>
                            Remove Agent
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        {/* Dialogs */}
        <Dialog.Root
          key={dialogType || "none"}
          open={dialogOpen}
          onOpenChange={({ open }) => {
            setDialogOpen(open);
            if (!open) handleCloseDialog();
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>
                    {dialogType === "assign" && "Assign/Remove Projects"}
                    {dialogType === "remove" && "Remove Admin"}
                  </Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" position="absolute" top="2" right="2" onClick={handleCloseDialog} />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  {dialogType === "assign" && dialogAgent && (
                    <VStack spacing={4} align="stretch">
                      <Text>Assign up to 3 projects to <b>{dialogAgent.name}</b></Text>
                      <Select.Root
                        width="100%"
                        collection={projectOptions}
                        multiple
                        value={assignProjects}
                        onValueChange={({ value }) => setAssignProjects(value)}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            {/* FIX: Map the selected project IDs back to their names for display */}
                            <Select.ValueText>
                              {assignProjects.length > 0
                                ? assignProjects
                                    .map((pid) => {
                                      const project = projects.find((p) => p.id === pid);
                                      return project ? project.name : null;
                                    })
                                    .filter(Boolean) // Remove any nulls if project not found
                                    .join(", ")
                                : "Select up to 3 Projects"}
                            </Select.ValueText>
                          </Select.Trigger>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner zIndex={1700} style={{ zIndex: 1700 }}>
                            <Select.Content>
                              {projectOptions.items.map((project) => (
                                <Select.Item
                                  key={project.value}
                                  item={project}
                                  disabled={
                                    assignProjects.length >= 3 &&
                                    !assignProjects.includes(project.value)
                                  }
                                >
                                  {project.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                      <Button
                        colorScheme="blue"
                        onClick={handleAssignProjects}
                        isDisabled={assignProjects.length === 0}
                      >
                        Save Projects
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "remove" && dialogAdmin && (
                    <VStack spacing={4} align="stretch">
                      <Text>Remove <b>{dialogAdmin.full_name}</b> from admins?</Text>
                      <Button colorScheme="red" onClick={handleRemoveAdmin}>
                        Remove
                      </Button>
                    </VStack>
                  )}
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Flex>
    </Flex>
  );
};

export default StaffManagement;