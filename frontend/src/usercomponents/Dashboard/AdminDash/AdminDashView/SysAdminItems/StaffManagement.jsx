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
  Dialog,
  Portal,
  Select,
  Menu,
  createListCollection,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

// --- FIX 1: Update data model for multi-project ---
const initialStaff = [
  {
    id: 1,
    full_name: "Jane Doe",
    email: "jane@example.com",
    last_sign_in_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    project: ["Project Alpha"],
  },
  {
    id: 2,
    full_name: "Mike Wilson",
    email: "mike@example.com",
    last_sign_in_at: null,
    project: ["Project Gamma", "Project Beta"],
  },
  {
    id: 3,
    full_name: "Alice Brown",
    email: "alice@example.com",
    last_sign_in_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    project: ["Project Beta"],
  },
];

const projectOptions = createListCollection({
  items: [
    "Project Alpha",
    "Project Beta",
    "Project Gamma",
    "Project Delta",
  ].map((project) => ({
    label: project,
    value: project,
  })),
});

const StaffManagement = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [loading, setLoading] = useState(true); // <-- Add loading state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStaff, setDialogStaff] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'assign', 'add', 'remove'
  // --- FIX 1: Update state to handle an array ---
  const [assignProject, setAssignProject] = useState([]);
  const [newStaff, setNewStaff] = useState({
    full_name: "",
    email: "",
    // --- FIX 1: Update state to handle an array ---
    project: ["Project Alpha"],
  });

  const isMobileView = useBreakpointValue({ base: true, md: false });

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);
    // Replace this timeout with your real fetch logic
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Open dialog helpers
  const openAssignProject = (staffMember) => {
    setDialogStaff(staffMember);
    // --- FIX 1: Ensure project is always an array ---
    setAssignProject(staffMember.project || []);
    setDialogType("assign");
    setDialogOpen(true);
  };

  const openAddStaff = () => {
    setNewStaff({ full_name: "", email: "", project: [] });
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

  // Assign Project submit
  const handleAssignProject = () => {
    toaster.create({
      title: "Projects Assigned",
      description: `Assigned ${assignProject.join(", ")} to ${
        dialogStaff.full_name
      }`,
      type: "success",
    });
    setStaff((prev) =>
      prev.map((s) =>
        s.id === dialogStaff.id ? { ...s, project: assignProject } : s
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
        project: newStaff.project,
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
            {loading ? (
              // Show 3 skeleton rows as placeholders
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
            ) : staff.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">
                No staff found.
              </Text>
            ) : (
              staff.map((member) => (
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
                    <HStack fontSize="xs" color="gray.400" mt={1}>
                      <Text>Projects:</Text>
                      {/* --- FIX 1: Map over projects array --- */}
                      {member.project.map((p) => (
                        <Badge key={p} colorScheme="green">
                          {p}
                        </Badge>
                      ))}
                    </HStack>
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
                            value="assign-project"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignProject(member);
                            }}
                          >
                            Assign Project
                          </Menu.Item>
                          <Menu.Item
                            value="remove-staff"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRemoveStaff(member);
                            }}
                          >
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
                    {dialogType === "assign" && `Assign Project`}
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
                        Assign a project to <b>{dialogStaff.full_name}</b>
                      </Text>
                      <Select.Root
                        width="100%"
                        collection={projectOptions}
                        multiple
                        value={assignProject}
                        onValueChange={({ value }) => setAssignProject(value)}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select up to 3 Projects" />
                          </Select.Trigger>
                        </Select.Control>
                        {/* Use a Portal with a high zIndex to ensure dropdown appears above dialog */}
                        <Portal>
                          <Select.Positioner zIndex={1700} style={{ zIndex: 1700 }}>
                            <Select.Content>
                              {projectOptions.items.map((project) => (
                                <Select.Item
                                  key={project.value}
                                  item={project}
                                  disabled={
                                    assignProject.length >= 3 &&
                                    !assignProject.includes(project.value)
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
                        onClick={handleAssignProject}
                        isDisabled={assignProject.length === 0}
                      >
                        Assign Projects
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
                      <Select.Root
                        width="100%"
                        collection={projectOptions}
                        multiple
                        value={newStaff.project}
                        onValueChange={({ value }) =>
                          setNewStaff((u) => ({ ...u, project: value }))
                        }
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select up to 3 Projects" />
                          </Select.Trigger>
                        </Select.Control>
                        {/* Use a Portal with a high zIndex to ensure dropdown appears above dialog */}
                        <Portal>
                          <Select.Positioner zIndex={1700} style={{ zIndex: 1700 }}>
                            <Select.Content>
                              {projectOptions.items.map((project) => (
                                <Select.Item
                                  key={project.value}
                                  item={project}
                                  disabled={
                                    newStaff.project.length >= 3 &&
                                    !newStaff.project.includes(project.value)
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
                        onClick={handleAddStaff}
                        isDisabled={
                          !newStaff.full_name ||
                          !newStaff.email ||
                          newStaff.project.length === 0
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