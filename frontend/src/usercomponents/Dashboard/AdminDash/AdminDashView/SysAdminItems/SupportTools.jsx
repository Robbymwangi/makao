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
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

const mockTickets = [
  {
    id: 1,
    subject: "Cannot login to admin portal",
    status: "Open",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    category: "System",
    assignedTo: "Robbi Darwis",
    createdBy: "Robbi Darwis",
    description: "I am unable to login to the admin portal since yesterday.",
  },
  {
    id: 2,
    subject: "Agent assignment issue",
    status: "Pending",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    category: "Agent",
    assignedTo: "Jane Smith",
    createdBy: "Robbi Darwis",
    description: "Agent cannot be assigned to user X.",
  },
  {
    id: 3,
    subject: "Property data not updating",
    status: "Closed",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 48),
    category: "Property",
    assignedTo: "John Doe",
    createdBy: "Alice Brown",
    description: "Property data changes are not reflected in dashboard.",
  },
  {
    id: 4,
    subject: "Feature request: Export reports",
    status: "Open",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 5),
    category: "Other",
    assignedTo: "Robbi Darwis",
    createdBy: "Jane Smith",
    description: "Please add export to CSV for all reports.",
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

const SupportTools = () => {
  // Simulate current admin
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

  // My tickets = assigned to me or created by me
  const myTickets = useMemo(
    () => tickets.filter(
      (t) => t.assignedTo === currentAdmin || t.createdBy === currentAdmin
    ),
    [tickets]
  );

  // Global tickets, filtered
  const globalTickets = useMemo(() => {
    if (filterCategory === "All") return tickets;
    return tickets.filter((t) => t.category === filterCategory);
  }, [tickets, filterCategory]);

  // Handle close ticket
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

  // Handle open ticket dialog
  const handleOpenTicketDialog = (ticket) => {
    setDialogTicket(ticket);
    setDialogOpen(true);
  };

  // Handle create ticket
  const handleCreateTicket = () => {
    setCreating(true);
    setTimeout(() => {
      setTickets((prev) => [
        {
          id: prev.length + 1,
          subject: newTicket.subject,
          description: newTicket.description,
          status: "Open",
          lastUpdate: new Date(),
          category: newTicket.category,
          assignedTo: newTicket.assignedTo || currentAdmin,
          createdBy: currentAdmin,
        },
        ...prev,
      ]);
      setCreating(false);
      setCreateDialogOpen(false);
      setNewTicket({ subject: "", description: "", category: "System", assignedTo: "" });
      toaster.create({
        title: "Ticket Created",
        description: "Your ticket has been opened.",
        type: "success",
      });
    }, 1200);
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
          <HStack p={4} borderBottomWidth="1px" borderColor="gray.200" justify="space-between">
            <Text fontSize="xl" fontWeight="bold">
              My Tickets
            </Text>
            <Dialog.Root open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <Dialog.Trigger asChild>
                <Button size="sm" variant="outline" colorScheme="blue">
                  Open Ticket
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content maxW="lg">
                    <Dialog.Header>
                      <Dialog.Title>Open New Ticket</Dialog.Title>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" position="absolute" top="2" right="2" />
                      </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body pb="8">
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Text mb={1} fontWeight="medium">Subject</Text>
                          <Input
                            value={newTicket.subject}
                            onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                            placeholder="Enter ticket subject"
                            bg="white"
                          />
                        </Box>
                        <Box>
                          <Text mb={1} fontWeight="medium">Description</Text>
                          <Textarea
                            value={newTicket.description}
                            onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                            placeholder="Describe the issue"
                            bg="white"
                          />
                        </Box>
                        <Box>
                          <Text mb={1} fontWeight="medium">Category</Text>
                          <Select
                            value={newTicket.category}
                            onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                            bg="white"
                          >
                            {categories.filter(c => c !== "All").map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </Select>
                        </Box>
                        <Box>
                          <Text mb={1} fontWeight="medium">Assign To</Text>
                          <Input
                            value={newTicket.assignedTo}
                            onChange={e => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                            placeholder="Assign to (admin name)"
                            bg="white"
                          />
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
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {myTickets.length === 0 && (
              <Text color="gray.400" p={8} textAlign="center">
                No tickets yet.
              </Text>
            )}
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
                    <Text fontWeight="bold" noOfLines={1}>{ticket.subject}</Text>
                    <Badge colorPalette={statusColorPalette[ticket.status] || "gray"} mt={2}>{ticket.status}</Badge>
                  </Box>
                  {ticket.status !== "Closed" && (
                    <Button size="xs" colorScheme="red" variant="outline" onClick={e => { e.stopPropagation(); handleCloseTicket(ticket.id); }}>
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
          <HStack p={4} borderBottomWidth="1px" borderColor="gray.200" justify="space-between">
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
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto" divideY="1px" divideColor="gray.100">
            {globalTickets.length === 0 && (
              <Text color="gray.400" p={8} textAlign="center">
                No tickets in this category.
              </Text>
            )}
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
                    <Text fontWeight="bold" noOfLines={1}>{ticket.subject}</Text>
                    <HStack spacing={2} mt={2}>
                      <Badge colorPalette={statusColorPalette[ticket.status] || "gray"}>{ticket.status}</Badge>
                      <Badge colorPalette={categoryColorPalette[ticket.category] || "gray"}>{ticket.category}</Badge>
                    </HStack>
                  </Box>
                  <Text fontSize="xs" color="gray.500">
                    {ticket.lastUpdate ? new Date(ticket.lastUpdate).toLocaleString() : ""}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Ticket Details Dialog */}
        <Dialog.Root key={dialogTicket?.id ?? 'no-ticket'} open={dialogOpen} onOpenChange={setDialogOpen}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>{dialogTicket?.subject || "Ticket"}</Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" position="absolute" top="2" right="2" />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  {dialogTicket && (
                    <DataList.Root orientation="horizontal">
                      <DataList.Item>
                        <DataList.ItemLabel>Status</DataList.ItemLabel>
                        <DataList.ItemValue>
                          <Badge colorPalette={statusColorPalette[dialogTicket.status] || "gray"}>{dialogTicket.status}</Badge>
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Category</DataList.ItemLabel>
                        <DataList.ItemValue>
                          <Badge colorPalette={categoryColorPalette[dialogTicket.category] || "gray"}>{dialogTicket.category}</Badge>
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Assigned To</DataList.ItemLabel>
                        <DataList.ItemValue>{dialogTicket.assignedTo}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Created By</DataList.ItemLabel>
                        <DataList.ItemValue>{dialogTicket.createdBy}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Last Update</DataList.ItemLabel>
                        <DataList.ItemValue>{dialogTicket.lastUpdate ? new Date(dialogTicket.lastUpdate).toLocaleString() : ""}</DataList.ItemValue>
                      </DataList.Item>
                    </DataList.Root>
                  )}
                  <Box mt={6}>
                    <Text fontWeight="bold" mb={2}>Description</Text>
                    <Text>{dialogTicket?.description}</Text>
                  </Box>
                </Dialog.Body>
                <Dialog.Footer>
                  {dialogTicket && dialogTicket.status !== "Closed" && (
                    <Button colorScheme="red" variant="outline" onClick={() => { handleCloseTicket(dialogTicket.id); setDialogOpen(false); }}>
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