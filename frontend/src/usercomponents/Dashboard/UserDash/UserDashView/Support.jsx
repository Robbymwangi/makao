import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Textarea,
  Badge,
  Heading,
  useBreakpointValue,
  CloseButton,
  DataList,
  Dialog,
  Portal,
  RadioCard,
  Stack,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "lucide-react";
import { toaster } from "@/components/ui/toaster"; 

// Add CSR field to initialTickets
const initialTickets = [
  {
    id: 1,
    subject: "Cannot login to my account",
    status: "Open",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    csr: "John Doe", // CSR handling the ticket
    messages: [
      {
        id: 1,
        sender: "You",
        text: "I can't log in since yesterday.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: 2,
        sender: "Support",
        text: "We're looking into this for you.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      },
    ],
  },
  {
    id: 2,
    subject: "Feature request: Dark mode",
    status: "Closed",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    csr: "Jane Smith", // CSR handling the ticket
    messages: [
      {
        id: 1,
        sender: "You",
        text: "Can you add dark mode?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      },
      {
        id: 2,
        sender: "Support",
        text: "Thanks for your suggestion! We'll consider it.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    ],
  },
];

const statusColor = {
  Open: "green",
  Closed: "gray",
  Pending: "orange",
};

const issueTypes = [
  {
    value: "agent",
    title: "Agent",
    description: "Issue with a specific agent",
  },
  {
    value: "property",
    title: "Property",
    description: "Issue with a property or contractor",
  },
  {
    value: "platform",
    title: "Platform",
    description: "Issue with the website or app",
  },
  {
    value: "other",
    title: "Other",
    description: "For any other issues",
  },
];

// Define all possible form fields for reset
const initialFormData = {
  agentIssue: "",
  propertyIssue: "",
  platformIssue: "",
  otherIssue: "",
  agentName: "",
  agentIssueDate: "",
  propertyDetails: "",
  propertyIssueDate: "",
  platformFeature: "",
  platformIssueDate: "",
  otherDetails: "",
  otherIssueDate: "",
};

function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTicket, setDialogTicket] = useState(null);
  const [issueType, setIssueType] = useState("agent");
  const [formData, setFormData] = useState(initialFormData);
  const messagesEndRef = useRef(null);

  const isMobileView = useBreakpointValue({ base: true, md: false });

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId),
    [tickets, selectedTicketId]
  );

  const handleCreateTicket = () => {
    if (!newSubject.trim() || !newMessage.trim()) return;
    
    const newTicket = {
      id: tickets.length ? Math.max(...tickets.map((t) => t.id)) + 1 : 1,
      subject: newSubject,
      status: "Open",
      lastUpdate: new Date(),
      csr: "Unassigned",
      messages: [
        {
          id: 1,
          sender: "You",
          text: newMessage,
          timestamp: new Date(),
        },
      ],
    };
    
    setTickets([newTicket, ...tickets]);
    setShowNewTicket(false);
    setNewSubject("");
    setNewMessage("");
    setSelectedTicketId(newTicket.id);
    
    // Show success toast
    toaster.create({
      title: "Ticket Created",
      description: "Your support ticket has been successfully created",
      type: "success",
      duration: 6000,
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    const updatedTickets = tickets.map((t) =>
      t.id === selectedTicket.id
        ? {
            ...t,
            lastUpdate: new Date(),
            messages: [
              ...t.messages,
              {
                id: t.messages.length + 1,
                sender: "You",
                text: replyText,
                timestamp: new Date(),
              },
            ],
          }
        : t
    );
    
    setTickets(updatedTickets);
    setReplyText("");
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Show success toast
    toaster.create({
      title: "Issue Submitted",
      description: "Your issue has been sent. A response will be sent to your email and in-app message soon.",
      type: "success",
      duration: 6000,
    });
    
    // Reset form fields
    setFormData(initialFormData);
  };

  function handleCloseDialog() {
    setDialogOpen(false);
    setDialogTicket(null);
  }

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      <Heading
        size="4xl"
        fontWeight="bold"
        mb={6}
        fontFamily="'Playfair Display', serif"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }}
      >
        Support
      </Heading>
      <Stack
        direction={{ base: "column", md: "row" }}
        flex="1"
        minH={0}
        gap={4}
        bg="white"
        overflow="hidden"
        h="100%"
      >
        {/* Ticket List */}
        <Box
          flex={{ base: "none", md: 1 }}
          width={{ base: "100%", md: "50%" }}
          minW={0}
          minH={{ base: "300px", md: "400px", lg: "500px" }}
          maxH={{ base: "50vh", md: "none" }}
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
          </HStack>
          <VStack
            spacing={0}
            align="stretch"
            flexGrow={1}
            overflowY="auto"
            divideY="1px"
            divideColor="gray.100"
          >
            {tickets.length === 0 && (
              <Text color="gray.400" p={8} textAlign="center">
                No tickets yet.
              </Text>
            )}
            {tickets.map((ticket) => (
              <Box
                key={ticket.id}
                p={4}
                cursor="pointer"
                bg={ticket.id === selectedTicketId ? "blue.50" : "white"}
                _hover={{ bg: "gray.100" }}
                onClick={() => {
                  setDialogTicket(ticket);
                  setDialogOpen(true);
                }}
              >
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold" noOfLines={1}>
                      {ticket.subject}
                    </Text>
                    <Badge
                      colorScheme={statusColor[ticket.status] || "gray"}
                      mt={2}
                    >
                      {ticket.status}
                    </Badge>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* New Ticket Form (if shown) */}
        {showNewTicket && (
          <Box
            flex={{ base: "none", md: 1 }}
            width={{ base: "100%", md: "50%" }}
            minH={{ base: "300px", md: "400px", lg: "500px" }}
            maxH={{ base: "50vh", md: "none" }}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            shadow="sm"
            p={8}
            display="flex"
            flexDirection="column"
            maxW="100%"
            mx="auto"
            alignSelf="center"
            overflowY="auto"
          >
            <HStack mb={6}>
              {isMobileView && (
                <Button
                  variant="ghost"
                  onClick={() => setShowNewTicket(false)}
                  leftIcon={<ArrowLeftIcon size={18} />}
                >
                  Back
                </Button>
              )}
              <Text fontSize="xl" fontWeight="bold">
                Report an Issue
              </Text>
            </HStack>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Subject
                </Text>
                <Input
                  placeholder="Briefly describe your issue"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Details
                </Text>
                <Textarea
                  placeholder="Describe your issue in detail"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={5}
                />
              </Box>
              <Button
                colorScheme="blue"
                onClick={handleCreateTicket}
                isDisabled={!newSubject.trim() || !newMessage.trim()}
              >
                Submit
              </Button>
            </VStack>
          </Box>
        )}

        {/* Right-Side Form (always visible) */}
        <Box
          flex={{ base: "none", md: 1 }}
          width={{ base: "100%", md: "50%" }}
          minH={{ base: "300px", md: "400px", lg: "500px" }}
          maxH={{ base: "50vh", md: "none" }}
          borderWidth="1px"
          borderRadius="lg"
          bg="gray.50"
          shadow="sm"
          p={0}
          display="flex"
          flexDirection="column"
          overflowY="auto"
          minW={0}
          maxW="100%"
        >
          <HStack
            p={4}
            borderBottomWidth="1px"
            borderColor="gray.200"
            justify="space-between"
            bg="gray.50"
            borderTopRadius="lg"
          >
            <Text fontSize="xl" fontWeight="bold">
              Report an Issue
            </Text>
          </HStack>
          <Box p={{ base: 4, md: 8 }} flex="1" overflowY="auto">
            <VStack as="form" spacing={4} align="stretch" onSubmit={handleFormSubmit}>
              <RadioCard.Root
                value={issueType}
                onValueChange={(value) => setIssueType(value)}
              >
                <RadioCard.Label>
                  What is the issue related to?
                </RadioCard.Label>
                <VStack align="stretch" mt={2}>
                  {issueTypes.map((item) => (
                    <RadioCard.Item key={item.value} value={item.value}>
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemContent>
                          <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                          <RadioCard.ItemDescription>
                            {item.description}
                          </RadioCard.ItemDescription>
                        </RadioCard.ItemContent>
                        <RadioCard.ItemIndicator />
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  ))}
                </VStack>
              </RadioCard.Root>

              {/* Divider between RadioCard and dynamic fields */}
              <Box borderBottomWidth="1px" borderColor="gray.400" my={6} />

              {/* Dynamic Fields Based on Issue Type */}
              {issueType === "agent" && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Please describe the issue with the agent:
                  </Text>
                  <Textarea
                    name="agentIssue"
                    placeholder="Describe the issue with the agent"
                    value={formData.agentIssue}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    What is the agent's name (if known)?
                  </Text>
                  <Input
                    name="agentName"
                    placeholder="Enter the agent's name"
                    value={formData.agentName}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    When did the issue occur?
                  </Text>
                  <Input
                    type="date"
                    name="agentIssueDate"
                    value={formData.agentIssueDate}
                    onChange={handleFormChange}
                  />
                </Box>
              )}

              {issueType === "property" && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Please describe the issue with the property or contractor:
                  </Text>
                  <Textarea
                    name="propertyIssue"
                    placeholder="Describe the issue with the property or contractor"
                    value={formData.propertyIssue}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    What is the property address or contractor's name?
                  </Text>
                  <Input
                    name="propertyDetails"
                    placeholder="Enter the property address or contractor's name"
                    value={formData.propertyDetails}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    When did the issue occur?
                  </Text>
                  <Input
                    type="date"
                    name="propertyIssueDate"
                    value={formData.propertyIssueDate}
                    onChange={handleFormChange}
                  />
                </Box>
              )}

              {issueType === "platform" && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Please describe the issue with the platform:
                  </Text>
                  <Textarea
                    name="platformIssue"
                    placeholder="Describe the issue with the platform"
                    value={formData.platformIssue}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    What feature or section of the platform is affected?
                  </Text>
                  <Input
                    name="platformFeature"
                    placeholder="Enter the affected feature or section"
                    value={formData.platformFeature}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    When did the issue start?
                  </Text>
                  <Input
                    type="date"
                    name="platformIssueDate"
                    value={formData.platformIssueDate}
                    onChange={handleFormChange}
                  />
                </Box>
              )}

              {issueType === "other" && (
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Please describe the issue:
                  </Text>
                  <Textarea
                    name="otherIssue"
                    placeholder="Describe the issue"
                    value={formData.otherIssue}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    Is there any additional information you'd like to provide?
                  </Text>
                  <Textarea
                    name="otherDetails"
                    placeholder="Enter additional details"
                    value={formData.otherDetails}
                    onChange={handleFormChange}
                  />
                  <Text fontWeight="medium" mt={4} mb={2}>
                    When did the issue occur?
                  </Text>
                  <Input
                    type="date"
                    name="otherIssueDate"
                    value={formData.otherIssueDate}
                    onChange={handleFormChange}
                  />
                </Box>
              )}

              {/* Submit Button */}
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </VStack>
          </Box>
        </Box>

        {/* Ticket Dialog */}
        <Dialog.Root
          key={dialogTicket?.id ?? "no-ticket"}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              // Delay clearing dialogTicket to allow close animation
              setTimeout(() => setDialogTicket(null), 300);
            }
          }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>
                    {dialogTicket?.subject || "Ticket"}
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
                  {dialogTicket && (
                    <DataList.Root orientation="horizontal">
                      <DataList.Item>
                        <DataList.ItemLabel>Status</DataList.ItemLabel>
                        <DataList.ItemValue>
                          <Badge
                            colorScheme={
                              statusColor[dialogTicket.status] || "gray"
                            }
                          >
                            {dialogTicket.status}
                          </Badge>
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Last Update</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dialogTicket.lastUpdate
                            ? new Date(
                                dialogTicket.lastUpdate
                              ).toLocaleString()
                            : ""}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>CSR</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dialogTicket.csr || "Unassigned"}
                        </DataList.ItemValue>
                      </DataList.Item>
                    </DataList.Root>
                  )}
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Stack>
    </Flex>
  );
}

export default Support;