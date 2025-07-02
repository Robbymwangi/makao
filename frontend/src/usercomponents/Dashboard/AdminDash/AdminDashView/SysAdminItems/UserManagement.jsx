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
  // Ensure these are correctly imported based on your Chakra UI setup
  // For Chakra UI v2 with Ark UI integration, these are the typical imports:
  Portal,
  Select, // Assuming this imports the Select.Root, Select.Control, etc.
  Menu, // Assuming this imports Menu.Root, Menu.Trigger, etc.
} from "@chakra-ui/react";
// If you're using `@chakra-ui/react/components` for these, adjust imports accordingly.
// For example:
// import { Select } from "@chakra-ui/react/components"; // This is often how it's done for v2+

// If Dialog is not from @chakra-ui/react, adjust this import.
// It looks like it's behaving like Ark UI's Dialog, which Chakra UI integrates.
import { Dialog } from "@chakra-ui/react"; // Adjust if your Dialog comes from a different package

import { toaster, Toaster } from "@/components/ui/toaster";
// Assuming createListCollection is still available from @chakra-ui/react or a utility
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
        // Ensure last_sign_in_at is consistently handled as a Date or null
        last_sign_in_at: u.last_sign_in_at ? new Date(u.last_sign_in_at) : null,
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
      if (!res.ok) {
        const errorMessage = data.error || "Failed to fetch agents";
        throw new Error(errorMessage);
      }

      setAgents(data);
      // createListCollection is part of the Ark UI integration
      const options = createListCollection({
        items: [
          { label: "Unassigned", value: "" }, // Ensure 'value' for unassigned is an empty string
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
  }, []); // Empty dependency array means this runs once on mount

  const openDialog = (type, user = null) => {
    setDialogType(type);
    setDialogUser(user);
    // Set assignAgent only if opening 'assign' dialog and a user is provided
    if (type === "assign" && user) {
      setAssignAgent(user.agent || "");
    } else {
      setAssignAgent(""); // Clear for other dialog types
    }
    // Clear new user data when opening other dialog types
    if (type !== "create") {
      setNewUser({ full_name: "", email: "", password: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Give time for exit animation before clearing content
    setTimeout(() => {
      setDialogType(null);
      setDialogUser(null);
      setAssignAgent("");
      setNewUser({ full_name: "", email: "", password: "" }); // Clear new user form
    }, 300);
  };

  const handleAssignAgent = async () => {
    if (!dialogUser) return; // Should not happen if dialogUser is set correctly

    try {
      const res = await fetch("http://localhost:3000/users/assign-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: dialogUser.id,
          agent_id: assignAgent || null, // Send null if unassigned
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

      await fetchUsers(); // Re-fetch users to update UI with new agent assignment
      handleCloseDialog();
    } catch (err) {
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.full_name || !newUser.email || !newUser.password) {
      toaster.create({ title: "Validation Error", description: "All fields are required.", type: "warning" });
      return;
    }

    try {
      // API call to create a new user
       const res = await fetch("http://localhost:3000/users", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newUser),
       });
       const result = await res.json();
       if (!res.ok) throw new Error(result.error || "Failed to create user");

      setUsers((prev) => [
        {
          id: `new-${Date.now()}`, // Unique ID for new user
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
    } catch (err) {
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  const handleResetPassword = async () => {
    if (!dialogUser) return;

    try {
      // In a real app, this would be an API call to send a reset link
      // Example:
      // const res = await fetch(`http://localhost:3000/users/${dialogUser.id}/reset-password`, {
      //   method: "POST",
      // });
      // const result = await res.json();
      // if (!res.ok) throw new Error(result.error || "Failed to send reset link");

      toaster.create({
        title: "Password Reset",
        description: `Password reset link sent to ${dialogUser.email}`,
        type: "info",
      });
      handleCloseDialog();
    } catch (err) {
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
            {users.length === 0 ? (
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
          key={dialogType || "none"} // Key helps re-mount dialog for cleaner state resets
          open={dialogOpen}
          onOpenChange={({ open }) => {
            setDialogOpen(open);
            if (!open) handleCloseDialog();
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg" p={6}> 
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
                      {/*
                         *** KEY CHANGE FOR Z-INDEX ***
                         Increased zIndex significantly.
                         Common Chakra UI dialogs often have z-index in the 1200-1600 range.
                         A value like 2000 or 3000 should ensure the select dropdown is on top.
                      */}
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
                          {/* Applying zIndex directly to Select.Positioner */}
                          <Select.Positioner zIndex={5000}>
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
                      <Button colorScheme="blue" onClick={handleAssignAgent} mt={4}>
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
                      />
                      <Input
                        placeholder="Email"
                        type="email" // Use type="email" for better validation
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                      <Input
                        placeholder="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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