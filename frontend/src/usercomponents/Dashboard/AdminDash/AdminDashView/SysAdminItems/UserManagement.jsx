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
  Heading,
  useBreakpointValue,
  CloseButton,
  Portal,
  Select,
  Menu,
  Skeleton,
  Stack,
  Dialog 
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { createListCollection } from "@chakra-ui/react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentOptions, setAgentOptions] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [assignAgent, setAssignAgent] = useState("");
  const [newUser, setNewUser] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true); // Add loading state

  const isMobileView = useBreakpointValue({ base: true, md: false });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/users");
      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.error || "Failed to fetch users";
        throw new Error(errorMessage);
      }

      const formatted = data.map((u) => ({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        last_sign_in_at: u.last_sign_in_at ? new Date(u.last_sign_in_at) : null,
        agent: u.agent || "",
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("Error fetching users:", err);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:3000/agents");
      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.error || "Failed to fetch agents";
        throw new Error(errorMessage);
      }

      setAgents(data);
      const options = createListCollection({
        items: [
          { label: "Unassigned", value: "" },
          ...data.map((a) => ({
            label: a.name || "Unnamed Agent",
            value: a.id,
          })),
        ],
      });
      setAgentOptions(options);
    } catch (err) {
      console.error("Error fetching agents:", err);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsers(), fetchAgents()])
      .finally(() => setLoading(false));
  }, []);

  const openDialog = (type, user = null) => {
    setDialogType(type);
    setDialogUser(user);
    if (type === "assign" && user) {
      setAssignAgent(user.agent || "");
    } else {
      setAssignAgent("");
    }
    if (type !== "create") {
      setNewUser({ full_name: "", email: "", password: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogUser(null);
      setAssignAgent("");
      setNewUser({ full_name: "", email: "", password: "" });
    }, 300);
  };

  const handleAssignAgent = async () => {
    if (!dialogUser) return;

    try {
      const res = await fetch("http://localhost:3000/users/assign-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: dialogUser.id,
          agent_id: assignAgent || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        const errorMessage = result.error || "Failed to assign agent";
        throw new Error(errorMessage);
      }

      toaster.create({
        title: "Agent Assigned",
        description: assignAgent
          ? `Assigned agent to ${dialogUser.full_name}`
          : `Unassigned agent from ${dialogUser.full_name}`,
        type: "success",
      });

      await fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error("Error assigning agent:", err);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.full_name || !newUser.email || !newUser.password) {
      toaster.create({
        title: "Validation Error",
        description: "All fields are required.",
        type: "warning",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      await fetchUsers();

      toaster.create({
        title: "User Created",
        description: `${newUser.full_name} has been added.`,
        type: "success",
      });
      handleCloseDialog();
    } catch (err) {
      console.error("Error creating user:", err);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const handleResetPassword = async () => {
    if (!dialogUser) return;

    try {
      toaster.create({
        title: "Password Reset",
        description: `Password reset link sent to ${dialogUser.email}`,
        type: "info",
      });
      handleCloseDialog();
    } catch (err) {
      console.error("Error resetting password:", err);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden" p={{ base: 4, lg: 8 }}>
      <Toaster />
      <Heading size="2xl" mb={6} fontFamily="'Playfair Display', serif" color="gray.800" textAlign={{ base: "center", lg: "left" }}>
        User Management
      </Heading>

      <Flex flex="1" gap={4} bg="white" direction={{ base: "column", md: "row" }} overflow="hidden">
        <Box
          flex="1"
          minW={{ base: "100%", md: "320px" }}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          shadow="sm"
          overflowY="auto"
        >
          <HStack p={4} borderBottomWidth="1px" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">Users Directory</Text>
            <Button colorScheme="blue" size="sm" onClick={() => openDialog("create")}>
              Create New User
            </Button>
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Stack key={i} p={4} gap={2}>
                  <Skeleton
                    height="20px"
                    width="40%"
                    variant="shine"
                    css={{
                      "--start-color": "colors.gray.200",
                      "--end-color": "colors.gray.400",
                    }}
                  />
                  <Skeleton
                    height="16px"
                    width="60%"
                    variant="shine"
                    css={{
                      "--start-color": "colors.gray.200",
                      "--end-color": "colors.gray.400",
                    }}
                  />
                  <Skeleton
                    height="14px"
                    width="30%"
                    variant="shine"
                    css={{
                      "--start-color": "colors.gray.200",
                      "--end-color": "colors.gray.400",
                    }}
                  />
                </Stack>
              ))
            ) : users.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">No users found.</Text>
            ) : (
              users.map((user) => (
                <Box key={user.id} p={4} _hover={{ bg: "gray.100" }} display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text fontWeight="bold">{user.full_name}</Text>
                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                    <Text fontSize="xs" color="gray.400">
                      Last Sign In: {user.last_sign_in_at ? user.last_sign_in_at.toLocaleString() : "Never"}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      Agent: {user.agent ? agents.find((a) => a.id === user.agent)?.name || user.agent : <span style={{ color: "#888" }}>Unassigned</span>}
                    </Text>
                  </Box>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="xs">Actions</Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openDialog("assign", user); }}>
                            Assign / Change Agent
                          </Menu.Item>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openDialog("reset", user); }}>
                            Reset Password
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

        {/* Dialog */}
        <Dialog.Root
          key={dialogType || "none"}
          open={dialogOpen}
          onOpenChange={({ open }) => {
            setDialogOpen(open);
            if (!open) handleCloseDialog();
          }}
        >
          <Portal>
            <Dialog.Backdrop zIndex={1400} />
            <Dialog.Positioner zIndex={1500}>
              <Dialog.Content maxW="lg" p={6} zIndex={1600}>
                <Dialog.Header>
                  <Dialog.Title>
                    {dialogType === "assign" && "Assign / Change Agent"}
                    {dialogType === "create" && "Create New User"}
                    {dialogType === "reset" && "Reset Password"}
                  </Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" position="absolute" top="2" right="2" onClick={handleCloseDialog} />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  {dialogType === "assign" && dialogUser && agentOptions && (
                    <VStack spacing={4} align="stretch">
                      <Text>Assign an agent to <b>{dialogUser.full_name}</b></Text>
                      <Select.Root
                        width="100%"
                        collection={agentOptions}
                        value={assignAgent ? [assignAgent] : []}
                        onValueChange={({ value }) => setAssignAgent(value[0] || "")}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select an Agent" />
                          </Select.Trigger>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner zIndex={10000}>
                            <Select.Content zIndex={10000}>
                              {agentOptions.items.map((agent) => (
                                <Select.Item key={agent.value} item={agent}>
                                  {agent.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                      <Button
                        colorScheme="blue"
                        onClick={handleAssignAgent}
                        isDisabled={!agentOptions || !assignAgent}
                        mt={4}
                      >
                        Save Assignment
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "create" && (
                    <VStack spacing={4} align="stretch">
                      <Input
                        placeholder="Full Name"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        bg="white"
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        bg="white"
                      />
                      <Input
                        placeholder="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        bg="white"
                      />
                      <Button
                        colorScheme="blue"
                        onClick={handleCreateUser}
                        isDisabled={!newUser.full_name || !newUser.email || !newUser.password}
                        mt={4}
                      >
                        Create User
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "reset" && dialogUser && (
                    <VStack spacing={4} align="stretch">
                      <Text>Send password reset link to <b>{dialogUser.email}</b></Text>
                      <Button colorScheme="blue" onClick={handleResetPassword} mt={4}>
                        Send Reset Link
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

export default UserManagement;