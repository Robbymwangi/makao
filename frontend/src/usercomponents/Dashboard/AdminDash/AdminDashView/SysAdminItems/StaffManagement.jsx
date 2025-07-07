"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Portal,
  Menu,
  Skeleton,
  Stack,
  CloseButton,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Dialog } from "@chakra-ui/react";

const StaffManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'remove', 'remove-agent'
  const [dialogAgent, setDialogAgent] = useState(null);
  const [dialogAdmin, setDialogAdmin] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdmins(), fetchAgents()]).finally(() => setLoading(false));
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

  // Dialog helpers
  const openRemoveAdmin = (admin) => {
    setDialogAdmin(admin);
    setDialogType("remove");
    setDialogOpen(true);
  };

  const openRemoveAgent = (agent) => {
    setDialogAgent(agent);
    setDialogType("remove-agent");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogAgent(null);
      setDialogAdmin(null);
    }, 300);
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
      fetchAdmins();
      handleCloseDialog();
    } catch (err) {
      toaster.create({ title: "Error", description: err.message, type: "error" });
    }
  };

  // Remove agent
  const handleRemoveAgent = async () => {
    try {
      const res = await fetch("http://localhost:3000/agents/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: dialogAgent.id }),
      });
      if (!res.ok) throw new Error("Failed to remove agent");
      toaster.create({
        title: "Agent Removed",
        description: `${dialogAgent.name} has been removed.`,
        type: "info",
      });
      fetchAgents();
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
                  </Box>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="xs">Actions</Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item onClick={(e) => { e.stopPropagation(); openRemoveAgent(agent); }}>
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
          onOpenChange={({ open }) => setDialogOpen(open)}
        >
          <Portal>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.CloseButton onClick={handleCloseDialog} />
                <Dialog.Body>
                  {dialogType === "remove" && dialogAdmin && (
                    <VStack spacing={4} align="stretch">
                      <Text>Remove <b>{dialogAdmin.full_name}</b> from admins?</Text>
                      <Button colorScheme="red" onClick={handleRemoveAdmin}>
                        Remove
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "remove-agent" && dialogAgent && (
                    <VStack spacing={4} align="stretch">
                      <Text>Remove <b>{dialogAgent.name}</b> from agents?</Text>
                      <Button colorScheme="red" onClick={handleRemoveAgent}>
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