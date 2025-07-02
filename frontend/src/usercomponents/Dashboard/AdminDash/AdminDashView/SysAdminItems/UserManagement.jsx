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
  Select,
  Menu,
  DataList,
  Dialog,
  Portal,
  Badge,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

// Static mock agents (optional: make dynamic later)
const mockAgents = ["Agent Smith", "Agent Jones", "Agent Carter"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'assign', 'create', 'reset'
  const [assignAgent, setAssignAgent] = useState("");
  const [newUser, setNewUser] = useState({ full_name: "", email: "", password: "" });

  const isMobileView = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch users");

        const formatted = data.map((u) => ({
          id: u.id,
          full_name: u.name,
          email: u.email,
          last_sign_in_at: u.last_sign_in_at,
          agent: u.agent || "",
        }));

        setUsers(formatted);
      } catch (err) {
        console.error("Error fetching users:", err.message);
        toaster.create({
          title: "Error",
          description: err.message,
          type: "error",
        });
      }
    };

    fetchUsers();
  }, []);

  const openAssignAgent = (user) => {
    setDialogUser(user);
    setAssignAgent(user.agent || "");
    setDialogType("assign");
    setDialogOpen(true);
  };

  const openCreateUser = () => {
    setNewUser({ full_name: "", email: "", password: "" });
    setDialogType("create");
    setDialogUser(null);
    setDialogOpen(true);
  };

  const openResetPassword = (user) => {
    setDialogUser(user);
    setDialogType("reset");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogUser(null);
    }, 300);
  };

  const handleAssignAgent = () => {
    toaster.create({
      title: "Agent Assigned",
      description: `Assigned ${assignAgent} to ${dialogUser.full_name}`,
      type: "success",
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === dialogUser.id ? { ...u, agent: assignAgent } : u))
    );
    handleCloseDialog();
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

//   const handleResetPassword = () => {
//     toaster.create({
//       title: "Password Reset",
//       description: `Password reset link sent to ${dialogUser.email}`,
//       type: "info",
//     });
//     handleCloseDialog();
//   };

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      <Toaster />
      <Heading
        size="4xl"
        fontWeight="bold"
        mb={6}
        fontFamily="'Playfair Display', serif"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }}
      >
        User Management
      </Heading>
      <Flex flex="1" minH={0} gap={4} bg="white">
        {/* User List */}
        <Box
          flex={{ base: "1", md: "1" }}
          minW={{ base: "100%", md: "320px" }}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          shadow="sm"
          overflowY="auto"
          display="flex"
          flexDirection="column"
        >
          <HStack p={4} borderBottomWidth="1px" borderColor="gray.200" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">All Users</Text>
            <Button colorScheme="blue" size="sm" onClick={openCreateUser}>
              Create New User
            </Button>
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {users.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">
                No users found.
              </Text>
            ) : (
              users.map((user) => (
                <Box
                  key={user.id}
                  p={4}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontWeight="bold">{user.full_name}</Text>
                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                    <Text fontSize="xs" color="gray.400">
                      Last Sign In: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      Agent: {user.agent || <span style={{ color: "#888" }}>Unassigned</span>}
                    </Text>
                  </Box>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="xs">Actions</Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openAssignAgent(user); }}>
                            Assign Agent
                          </Menu.Item>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openResetPassword(user); }}>
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

        {/* Dialogs */}
        <Menu.Dialog
          key={dialogType || "none"}
          open={dialogOpen}
          onOpenChange={({ open }) => {
            setDialogOpen(open);
            if (!open) handleCloseDialog();
          }}
        >
          <Portal>
            <Menu.Backdrop />
            <Menu.Positioner>
              <Menu.Content maxW="lg">
                <Menu.Header>
                  <Menu.Title>
                    {dialogType === "assign" && `Assign Agent`}
                    {dialogType === "create" && `Create New User`}
                    {dialogType === "reset" && `Reset Password`}
                  </Menu.Title>
                  <Menu.CloseTrigger asChild>
                    <CloseButton
                      size="sm"
                      position="absolute"
                      top="2"
                      right="2"
                      onClick={handleCloseDialog}
                    />
                  </Menu.CloseTrigger>
                </Menu.Header>
                <Menu.Body pb="8">
                  {dialogType === "assign" && dialogUser && (
                    <VStack spacing={4} align="stretch">
                      <Text>Assign an agent to <b>{dialogUser.full_name}</b></Text>
                      <Select
                        value={assignAgent}
                        onChange={(e) => setAssignAgent(e.target.value)}
                        placeholder="Select agent"
                        bg="white"
                      >
                        {mockAgents.map((agent) => (
                          <option key={agent} value={agent}>{agent}</option>
                        ))}
                      </Select>
                      <Button colorScheme="blue" onClick={handleAssignAgent} isDisabled={!assignAgent}>
                        Assign Agent
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
                      >
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
                </Menu.Body>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Dialog>
      </Flex>
    </Flex>
  );
};

export default UserManagement;
