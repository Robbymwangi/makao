"use client";

import React, { useState } from "react";
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
  Dialog,
  Portal,
  Select,
  Menu,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

// Mock staff data
const initialStaff = [
  {
    id: 1,
    full_name: "Jane Doe",
    email: "jane@example.com",
    last_sign_in_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    role: "Agent",
  },
  {
    id: 2,
    full_name: "Mike Wilson",
    email: "mike@example.com",
    last_sign_in_at: null,
    role: "Consultant",
  },
  {
    id: 3,
    full_name: "Alice Brown",
    email: "alice@example.com",
    last_sign_in_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    role: "Agent",
  },
];

const roleOptions = ["Agent", "Consultant"];

const StaffManagement = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStaff, setDialogStaff] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'assign', 'add', 'remove'
  const [assignRole, setAssignRole] = useState("");
  const [newStaff, setNewStaff] = useState({ full_name: "", email: "", role: "Agent" });

  const isMobileView = useBreakpointValue({ base: true, md: false });

  // Open dialog helpers
  const openAssignRole = (staffMember) => {
    setDialogStaff(staffMember);
    setAssignRole(staffMember.role || "");
    setDialogType("assign");
    setDialogOpen(true);
  };
  const openAddStaff = () => {
    setNewStaff({ full_name: "", email: "", role: "Agent" });
    setDialogType("add");
    setDialogStaff(null);
    setDialogOpen(true);
  };
  const openRemoveStaff = (staffMember) => {
    setDialogStaff(staffMember);
    setDialogType("remove");
    setDialogOpen(true);
  };

  // Dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogStaff(null);
    }, 300);
  };

  // Assign Role submit
  const handleAssignRole = () => {
    toaster.create({
      title: "Role Assigned",
      description: `Assigned ${assignRole} role to ${dialogStaff.full_name}`,
      type: "success",
    });
    setStaff((prev) =>
      prev.map((s) =>
        s.id === dialogStaff.id ? { ...s, role: assignRole } : s
      )
    );
    handleCloseDialog();
  };

  // Add Staff submit
  const handleAddStaff = () => {
    setStaff((prev) => [
      {
        id: prev.length + 1,
        full_name: newStaff.full_name,
        email: newStaff.email,
        last_sign_in_at: null,
        role: newStaff.role,
      },
      ...prev,
    ]);
    toaster.create({
      title: "Staff Added",
      description: `${newStaff.full_name} has been added.`,
      type: "success",
    });
    handleCloseDialog();
  };

  // Remove Staff submit
  const handleRemoveStaff = () => {
    toaster.create({
      title: "Staff Removed",
      description: `${dialogStaff.full_name} has been removed.`,
      type: "info",
    });
    setStaff((prev) => prev.filter((s) => s.id !== dialogStaff.id));
    handleCloseDialog();
  };

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
        Staff Management
      </Heading>
      <Flex flex="1" minH={0} gap={4} bg="white">
        {/* Staff List (Left Side) */}
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
          <HStack
            p={4}
            borderBottomWidth="1px"
            borderColor="gray.200"
            justify="space-between"
          >
            <Text fontSize="xl" fontWeight="bold">
              Staff Directory
            </Text>
            <Button colorScheme="blue" size="sm" onClick={openAddStaff}>
              Add Admin
            </Button>
          </HStack>
          <VStack
            spacing={0}
            align="stretch"
            flexGrow={1}
            overflowY="auto"
            divideY="1px"
            divideColor="gray.100"
          >
            {staff.length === 0 && (
              <Text color="gray.400" p={8} textAlign="center">
                No staff found.
              </Text>
            )}
            {staff.map((member) => (
              <Box
                key={member.id}
                p={4}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Text fontWeight="bold">{member.full_name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {member.email}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Last Sign In:{" "}
                    {member.last_sign_in_at
                      ? new Date(member.last_sign_in_at).toLocaleString()
                      : "Never"}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Role:{" "}
                    <Badge colorScheme={member.role === "Agent" ? "blue" : "purple"}>
                      {member.role}
                    </Badge>
                  </Text>
                </Box>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button variant="outline" size="xs">
                      Actions
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item
                          value="assign-role"
                          onClick={e => {
                            e.stopPropagation();
                            setDialogStaff(member);
                            setAssignRole(member.role || "");
                            setDialogType("assign");
                            setDialogOpen(true);
                          }}
                        >
                          Assign Role
                        </Menu.Item>
                        <Menu.Item
                          value="remove-staff"
                          onClick={e => {
                            e.stopPropagation();
                            setDialogStaff(member);
                            setDialogType("remove");
                            setDialogOpen(true);
                          }}
                        >
                          Remove Admin
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Dialogs */}
        <Dialog.Root
          key={dialogType || "none"}
          open={dialogOpen}
          onOpenChange={({ open }) => {
            setDialogOpen(open);
            if (!open) {
              setTimeout(() => {
                setDialogType(null);
                setDialogStaff(null);
              }, 300);
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>
                    {dialogType === "assign" && `Assign Role`}
                    {dialogType === "add" && `Add Admin`}
                    {dialogType === "remove" && `Remove Admin`}
                  </Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      size="sm"
                      position="absolute"
                      top="2"
                      right="2"
                      onClick={handleCloseDialog}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  {dialogType === "assign" && dialogStaff && (
                    <VStack spacing={4} align="stretch">
                      <Text>
                        Assign a role to <b>{dialogStaff.full_name}</b>
                      </Text>
                      <Select
                        value={assignRole}
                        onChange={(e) => setAssignRole(e.target.value)}
                        placeholder="Select role"
                        bg="white"
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Select>
                      <Button
                        colorScheme="blue"
                        onClick={handleAssignRole}
                        isDisabled={!assignRole}
                      >
                        Assign Role
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "add" && (
                    <VStack spacing={4} align="stretch">
                      <Input
                        placeholder="Full Name"
                        value={newStaff.full_name}
                        onChange={(e) =>
                          setNewStaff((u) => ({
                            ...u,
                            full_name: e.target.value,
                          }))
                        }
                        bg="white"
                      />
                      <Input
                        placeholder="Email"
                        value={newStaff.email}
                        onChange={(e) =>
                          setNewStaff((u) => ({
                            ...u,
                            email: e.target.value,
                          }))
                        }
                        bg="white"
                      />
                      <Select
                        value={newStaff.role}
                        onChange={(e) =>
                          setNewStaff((u) => ({
                            ...u,
                            role: e.target.value,
                          }))
                        }
                        bg="white"
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Select>
                      <Button
                        colorScheme="blue"
                        onClick={handleAddStaff}
                        isDisabled={
                          !newStaff.full_name ||
                          !newStaff.email ||
                          !newStaff.role
                        }
                      >
                        Add Admin
                      </Button>
                    </VStack>
                  )}
                  {dialogType === "remove" && dialogStaff && (
                    <VStack spacing={4} align="stretch">
                      <Text>
                        Remove <b>{dialogStaff.full_name}</b> from staff?
                      </Text>
                      <Button colorScheme="red" onClick={handleRemoveStaff}>
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