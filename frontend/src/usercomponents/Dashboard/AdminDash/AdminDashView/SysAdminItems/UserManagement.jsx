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
  Dialog,
  Portal,
  Select,
  Menu,
  createListCollection,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentOptions, setAgentOptions] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [assignAgent, setAssignAgent] = useState("");
  const [newUser, setNewUser] = useState({ full_name: "", email: "", password: "" });

  const isMobileView = useBreakpointValue({ base: true, md: false });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      const formatted = data.map((u) => ({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        last_sign_in_at: u.last_sign_in_at,
        agent: u.agent || "",
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:3000/agents");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch agents");

      setAgents(data);
      const options = createListCollection({
        items: [
          { label: "Unassigned", value: "" },
          ...data.map((a) => ({ label: a.name, value: a.id })),
        ],
      });
      setAgentOptions(options);
    } catch (err) {
      console.error("Error fetching agents:", err.message);
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAgents();
  }, []);

  const openDialog = (type, user = null) => {
    setDialogType(type);
    setDialogUser(user);
    setAssignAgent(user?.agent || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogUser(null);
    }, 300);
  };

  const handleAssignAgent = async () => {
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
      if (!res.ok) throw new Error(result.error || "Failed to assign agent");

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
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const handleCreateUser = () => {
    setUsers((prev) => [
      {
        id: prev.length + 1,
        full_name: newUser.full_name,
        email: newUser.email,
        last_sign_in_at: null,
        agent: "",
      },
      ...prev,
    ]);
    toaster.create({
      title: "User Created",
      description: `${newUser.full_name} has been added.`,
      type: "success",
    });
    handleCloseDialog();
  };

  const handleResetPassword = () => {
    toaster.create({
      title: "Password Reset",
      description: `Password reset link sent to ${dialogUser.email}`,
      type: "info",
    });
    handleCloseDialog();
  };

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      <Toaster />
      <Heading size="4xl" mb={6} fontFamily="'Playfair Display', serif" color="gray.800" textAlign={{ base: "center", lg: "left" }}>
        User Management
      </Heading>

      <Flex flex="1" gap={4} bg="white">
        <Box flex="1" minW={{ base: "100%", md: "320px" }} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm" overflowY="auto">
          <HStack p={4} borderBottomWidth="1px" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">Users Directory</Text>
            <Button colorScheme="blue" size="sm" onClick={() => openDialog("create")}>
              Create New User
            </Button>
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {users.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">No users found.</Text>
            ) : (
              users.map((user) => (
                <Box key={user.id} p={4} _hover={{ bg: "gray.100" }} display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text fontWeight="bold">{user.full_name}</Text>
                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                    <Text fontSize="xs" color="gray.400">
                      Last Sign In: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      Agent: {
                        user.agent
                          ? agents.find((a) => a.id === user.agent)?.name || user.agent
                          : <span style={{ color: "#888" }}>Unassigned</span>
                      }
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
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
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
                            <Select.ValueText placeholder="Select Agent" />
                          </Select.Trigger>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner zIndex={1700}>
                            <Select.Content>
                              {agentOptions.items.map((agent) => (
                                <Select.Item key={agent.value} item={agent}>
                                  {agent.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                      <Button colorScheme="blue" onClick={handleAssignAgent}>
                        Save Assignment
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "create" && (
                    <VStack spacing={4} align="stretch">
                      <Input placeholder="Full Name" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} />
                      <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                      <Input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                      <Button colorScheme="blue" onClick={handleCreateUser} isDisabled={!newUser.full_name || !newUser.email || !newUser.password}>
                        Create User
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "reset" && dialogUser && (
                    <VStack spacing={4} align="stretch">
                      <Text>Send password reset link to <b>{dialogUser.email}</b></Text>
                      <Button colorScheme="blue" onClick={handleResetPassword}>
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
