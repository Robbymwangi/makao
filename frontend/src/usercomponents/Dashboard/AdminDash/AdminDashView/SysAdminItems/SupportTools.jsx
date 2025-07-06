import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Badge,
  Dialog,
  Portal,
  CloseButton,
  DataList,
  Input,
  Textarea,
  Select,
  Menu,
  Spinner,
  createListCollection,
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

const mockTickets = [
  {
    id: 1,
    subject: "System performance issues on production server",
    description:
      "Users are reporting slow response times and occasional timeouts on the main production server. This started around 10:00 AM EAT. Initial checks show high CPU utilization.",
    status: "Open",
    category: "System",
    assignedTo: "Robbi Darwis",
    createdBy: "Alice Johnson",
    lastUpdate: new Date("2025-07-03T10:30:00Z"),
  },
  {
    id: 2,
    subject: "Agent 'John Doe' unable to log in",
    description:
      "Agent John Doe (ID: AGNT007) is repeatedly failing to log in. He claims his credentials are correct and has tried resetting his password multiple times. Error message 'Invalid credentials'.",
    status: "Pending",
    category: "Agent",
    assignedTo: "Sarah Smith",
    createdBy: "Robbi Darwis",
    lastUpdate: new Date("2025-07-02T15:00:00Z"),
  },
  {
    id: 3,
    subject: "Property 'Park Avenue Residences' details incorrect",
    description:
      "The address and contact information for 'Park Avenue Residences' in the property management system are outdated. Please update to 123 Main St, Anytown, USA, Phone: (555) 123-4567.",
    status: "Closed",
    category: "Property",
    assignedTo: "Robbi Darwis",
    createdBy: "David Lee",
    lastUpdate: new Date("2025-07-01T11:45:00Z"),
  },
  {
    id: 4,
    subject: "Request for new feature: Dark Mode toggle",
    description:
      "Users have requested a dark mode option for the application interface to reduce eye strain during extended use. This would be a beneficial accessibility feature.",
    status: "Open",
    category: "Other",
    assignedTo: "Unassigned",
    createdBy: "Emily White",
    lastUpdate: new Date("2025-06-30T09:00:00Z"),
  },
  {
    id: 5,
    subject: "Database connection intermittent on dev environment",
    description:
      "The development database occasionally loses connection, leading to application crashes during testing. This issue seems to be random and difficult to reproduce consistently.",
    status: "Open",
    category: "System",
    assignedTo: "Robbi Darwis",
    createdBy: "Michael Brown",
    lastUpdate: new Date("2025-07-03T14:15:00Z"),
  },
  {
    id: 6,
    subject: "Agent profile picture upload failing",
    description:
      "Agents are unable to upload their profile pictures. The upload progress bar gets stuck at 0% and eventually times out. No error message is displayed.",
    status: "Pending",
    category: "Agent",
    assignedTo: "Sarah Smith",
    createdBy: "John Smith",
    lastUpdate: new Date("2025-07-02T10:00:00Z"),
  },
  {
    id: 7,
    subject: "Missing lease agreement for 'Oakwood Apartments'",
    description:
      "The digital copy of the lease agreement for 'Oakwood Apartments' (Unit 3B) is missing from the system. Need to re-upload or locate the document.",
    status: "Open",
    category: "Property",
    assignedTo: "Unassigned",
    createdBy: "Maria Garcia",
    lastUpdate: new Date("2025-07-03T16:00:00Z"),
  },
  {
    id: 8,
    subject: "Printer not responding in main office",
    description:
      "The network printer in the main office (IP: 192.168.1.100) is not responding to print jobs from any workstation. Power cycling did not resolve the issue.",
    status: "Open",
    category: "System",
    assignedTo: "Robbi Darwis",
    createdBy: "Jane Doe",
    lastUpdate: new Date("2025-07-03T09:45:00Z"),
  },
];

const statusColorPalette = {
  Open: "green",
  Closed: "gray",
  Pending: "orange",
};

const categoryColorPalette = {
  System: "purple",
  Agent: "blue",
  Property: "green",
  Other: "gray",
};

const categories = ["All", "System", "Agent", "Property", "Other"];

const admins = [
  { label: "Robbi Darwis", value: "Robbi Darwis" },
  { label: "Sarah Smith", value: "Sarah Smith" },
  { label: "Unassigned", value: "Unassigned" },
];

const adminOptions = createListCollection({
  items: admins,
});

const SupportTools = () => {
  const currentAdmin = "Robbi Darwis";
  const [tickets, setTickets] = useState(mockTickets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTicket, setDialogTicket] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "System",
    assignedTo: "",
  });

  // Create a collection for the category select dropdown, like in UserManagement
  const categoryOptions = useMemo(
    () =>
      createListCollection({
        items: categories
          .filter((c) => c !== "All")
          .map((cat) => ({ label: cat, value: cat })),
      }),
    []
  );

  // Show all tickets in global overview
  const globalTickets = tickets;

  // "My Tickets" are those assigned to or created by the current admin
  const myTickets = useMemo(
    () =>
      tickets.filter(
        (t) => t.assignedTo === currentAdmin || t.createdBy === currentAdmin
      ),
    [tickets]
  );

  // Assign a ticket to the current admin
  const handleAssignToMe = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: currentAdmin } : t
      )
    );
    toaster.create({
      title: "Ticket Assigned",
      description: `Ticket #${ticketId} assigned to you.`,
      type: "success",
    });
  };

  // Move ticket to another admin
  const handleReassignTicket = (ticketId, newAdmin) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: newAdmin } : t
      )
    );
    toaster.create({
      title: "Ticket Reassigned",
      description: `Ticket #${ticketId} assigned to ${newAdmin}.`,
      type: "success",
    });
    setDialogTicket((t) =>
      t && t.id === ticketId ? { ...t, assignedTo: newAdmin } : t
    );
  };

  const handleCloseTicket = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Closed", lastUpdate: new Date() } : t
      )
    );
    toaster.create({
      title: "Ticket Closed",
      description: `Ticket #${id} has been closed.`,
      type: "success",
    });
  };

  const handleOpenTicketDialog = (ticket) => {
    setDialogTicket(ticket);
    setDialogOpen(true);
  };

  function handleCloseCreateDialog() {
    setCreateDialogOpen(false);
    setTimeout(() => {
      setNewTicket({
        subject: "",
        description: "",
        category: "System",
        assignedTo: "",
      });
    }, 300);
  }

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description) {
      toaster.create({
        title: "Validation Error",
        description: "Subject and description are required.",
        type: "warning",
      });
      return;
    }

    setCreating(true);
    setTimeout(() => {
      setTickets((prev) => [
        {
          id: prev.length + 1,
          ...newTicket,
          status: "Open",
          lastUpdate: new Date(),
          assignedTo: newTicket.assignedTo || currentAdmin,
          createdBy: currentAdmin,
        },
        ...prev,
      ]);
      setCreating(false);
      toaster.create({
        title: "Ticket Created",
        description: "Your ticket has been opened.",
        type: "success",
      });
      handleCloseCreateDialog();
    }, 1200);
  };

  function handleCloseDialog() {
    setDialogOpen(false);
    setDialogTicket(null);
  }

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
        Support Tools
      </Heading>
      <Flex flex="1" minH={0} gap={4} bg="white">
        {/* My Tickets (Left) */}
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
              My Tickets
            </Text>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              onClick={() => setCreateDialogOpen(true)}
            >
              Open Ticket
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
            {myTickets.map((ticket) => (
              <Box
                key={ticket.id}
                p={4}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleOpenTicketDialog(ticket)}
              >
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold" noOfLines={1}>
                      {ticket.subject}
                    </Text>
                    <Badge
                      colorScheme={statusColorPalette[ticket.status] || "gray"}
                      mt={2}
                    >
                      {ticket.status}
                    </Badge>
                  </Box>
                  {ticket.status !== "Closed" && (
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTicket(ticket.id);
                      }}
                    >
                      Close
                    </Button>
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Global Ticket Overview (Right) */}
        <Box
          flex="2"
          borderWidth="1px"
          borderRadius="lg"
          shadow="sm"
          p={0}
          display="flex"
          flexDirection="column"
          overflowY="auto"
        >
          <HStack
            p={4}
            borderBottomWidth="1px"
            borderColor="gray.200"
            justify="space-between"
          >
            <Text fontSize="xl" fontWeight="bold">
              Global Ticket Overview
            </Text>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="sm" variant="outline">
                  {filterCategory}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="180px">
                    {categories.map((cat) => (
                      <Menu.Item key={cat} onClick={() => setFilterCategory(cat)}>
                        {cat}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
          <VStack
            spacing={0}
            align="stretch"
            flexGrow={1}
            overflowY="auto"
            divideY="1px"
            divideColor="gray.100"
          >
            {globalTickets.map((ticket) => (
              <Box
                key={ticket.id}
                p={4}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleOpenTicketDialog(ticket)}
              >
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold" noOfLines={1}>
                      {ticket.subject}
                    </Text>
                    <HStack spacing={2} mt={2}>
                      <Badge
                        colorScheme={statusColorPalette[ticket.status] || "gray"}
                      >
                        {ticket.status}
                      </Badge>
                      <Badge
                        colorScheme={categoryColorPalette[ticket.category] || "gray"}
                      >
                        {ticket.category}
                      </Badge>
                    </HStack>
                  </Box>
                  <Box>
                    {ticket.assignedTo !== currentAdmin &&
                      ticket.status !== "Closed" && (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignToMe(ticket.id);
                          }}
                        >
                          Assign to Me
                        </Button>
                      )}
                  </Box>
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {new Date(ticket.lastUpdate).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Create Ticket Dialog */}
        <Dialog.Root
          open={createDialogOpen}
          onOpenChange={({ open }) => {
            if (!open) {
              handleCloseCreateDialog();
            } else {
              setCreateDialogOpen(true);
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>Open New Ticket</Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      size="sm"
                      position="absolute"
                      top="2"
                      right="2"
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Subject
                      </Text>
                      <Input
                        value={newTicket.subject}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, subject: e.target.value })
                        }
                        placeholder="Enter ticket subject"
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Description
                      </Text>
                      <Textarea
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket({
                            ...newTicket,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the issue"
                        bg="white"
                      />
                    </Box>
                    {/* 👇 FIX: Replaced simple Select with robust Select.Root pattern */}
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Category
                      </Text>
                      <Select.Root
                        width="100%"
                        collection={categoryOptions}
                        value={newTicket.category ? [newTicket.category] : []}
                        onValueChange={({ value }) =>
                          setNewTicket({ ...newTicket, category: value[0] || "" })
                        }
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select a Category" />
                          </Select.Trigger>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner zIndex={1700} style={{ zIndex: 1700 }}>
                            <Select.Content>
                              {categoryOptions.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Assign To
                      </Text>
                      <Select.Root
                        width="100%"
                        collection={adminOptions}
                        value={newTicket.assignedTo ? [newTicket.assignedTo] : []}
                        onValueChange={({ value }) =>
                          setNewTicket({ ...newTicket, assignedTo: value[0] || "" })
                        }
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Assign to (admin)" />
                          </Select.Trigger>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner zIndex={1700} style={{ zIndex: 1700 }}>
                            <Select.Content>
                              {adminOptions.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Box>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    colorScheme="blue"
                    onClick={handleCreateTicket}
                    isLoading={creating}
                    loadingText="Creating..."
                    isDisabled={!newTicket.subject || !newTicket.description}
                  >
                    Create Ticket
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        {/* Ticket Details Dialog */}
        <Dialog.Root
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              // Wait for the dialog close animation before clearing dialogTicket
              setTimeout(() => setDialogTicket(null), 300);
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>{dialogTicket?.subject || "Ticket"}</Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      size="sm"
                      position="absolute"
                      top="2"
                      right="2"
                      onClick={() => setDialogOpen(false)}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  {/* Always render the content, even if dialogTicket is null */}
                  <VStack spacing={4} align="stretch">
                    {dialogTicket ? (
                      <>
                        <DataList.Root orientation="horizontal">
                          <DataList.Item>
                            <DataList.ItemLabel>Status</DataList.ItemLabel>
                            <DataList.ItemValue>
                              <Badge
                                colorScheme={
                                  statusColorPalette[dialogTicket.status] || "gray"
                                }
                              >
                                {dialogTicket.status}
                              </Badge>
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Category</DataList.ItemLabel>
                            <DataList.ItemValue>
                              <Badge
                                colorScheme={
                                  categoryColorPalette[dialogTicket.category] ||
                                  "gray"
                                }
                              >
                                {dialogTicket.category}
                              </Badge>
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Assigned To</DataList.ItemLabel>
                            <DataList.ItemValue>
                              <Select.Root
                                collection={adminOptions}
                                size="sm"
                                value={[dialogTicket?.assignedTo || "Unassigned"]}
                                onValueChange={({ value }) =>
                                  handleReassignTicket(dialogTicket.id, value[0])
                                }
                              >
                                <Select.HiddenSelect />
                                <Select.Control>
                                  <Select.Trigger>
                                    <Select.ValueText placeholder="Assign to admin" />
                                  </Select.Trigger>
                                  <Select.IndicatorGroup>
                                    <Select.Indicator />
                                  </Select.IndicatorGroup>
                                </Select.Control>
                                <Select.Positioner>
                                  <Select.Content>
                                    {adminOptions.items.map((item) => (
                                      <Select.Item item={item} key={item.value}>
                                        {item.label}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Select.Root>
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Created By</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {dialogTicket.createdBy}
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Last Update</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {new Date(dialogTicket.lastUpdate).toLocaleString()}
                            </DataList.ItemValue>
                          </DataList.Item>
                        </DataList.Root>
                        <Box mt={6}>
                          <Text fontWeight="bold" mb={2}>
                            Description
                          </Text>
                          <Text>{dialogTicket.description}</Text>
                        </Box>
                      </>
                    ) : (
                      <Text color="gray.500">No ticket selected.</Text>
                    )}
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                  {dialogTicket && dialogTicket.status !== "Closed" && (
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        handleCloseTicket(dialogTicket.id);
                        setDialogOpen(false);
                      }}
                    >
                      Close Ticket
                    </Button>
                  )}
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Flex>
    </Flex>
  );
};

export default SupportTools;