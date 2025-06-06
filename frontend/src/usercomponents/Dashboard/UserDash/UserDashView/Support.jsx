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
} from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

// Initial ticket data
const initialTickets = [
  {
    id: 1,
    subject: "Cannot login to my account",
    status: "Open",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    csr: "John Doe",
  },
  {
    id: 2,
    subject: "Feature request: Dark mode",
    status: "Closed",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    csr: "Jane Smith",
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

// The initial state for a clean form
const initialFormData = {
  agentIssue: "",
  agentName: "",
  agentIssueDate: "",
  propertyIssue: "",
  propertyDetails: "",
  propertyIssueDate: "",
  platformIssue: "",
  platformFeature: "",
  platformIssueDate: "",
  otherIssue: "",
  otherDetails: "",
  otherIssueDate: "",
};

function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTicket, setDialogTicket] = useState(null);
  const [issueType, setIssueType] = useState("agent");
  const [formData, setFormData] = useState(initialFormData);

  const isMobileView = useBreakpointValue({ base: true, md: false });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        setFormData(initialFormData);
        resolve();
      }, 2000); // 2-second delay for simulation
    });

    toaster.promise(promise, {
      loading: {
        title: "Submitting your report...",
        description: "Please wait while we process your request.",
      },
      success: {
        title: "Report Submitted!",
        description: "Your issue has been received by support. Further steps will be sent to your email and in-app text.",
        duration: 3000,
      },
      error: {
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
      },
    });
  };

  function handleCloseDialog() {
    setDialogOpen(false);
    setDialogTicket(null);
  }

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      {/* Add Toaster here */}
      <Toaster />
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
      <Flex flex="1" minH={0} gap={4} bg="white">
        {/* Ticket List (Left Side) */}
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
                    <Badge colorScheme={statusColor[ticket.status] || "gray"} mt={2}>
                      {ticket.status}
                    </Badge>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Report an Issue Form (Right Side) */}
        <Box
          flex="1"
          borderWidth="1px"
          borderRadius="lg"
          shadow="sm"
          p={0}
          display={isMobileView ? "none" : "flex"}
          flexDirection="column"
          overflowY="auto"
        >
          <HStack
            p={4}
            borderBottomWidth="1px"
            borderColor="gray.200"
            justify="space-between"
            borderTopRadius="lg"
          >
            <Text fontSize="xl" fontWeight="bold">
              Report an Issue
            </Text>
          </HStack>
          <Box p={4} flex="1" overflowY="auto">
            <VStack spacing={4} align="stretch">
              <RadioCard.Root
                value={issueType}
                onValueChange={(e) => setIssueType(e.value)}
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

              <Box borderBottomWidth="1px" borderColor="gray.200" my={2} />

              {/* Dynamic Fields Based on Issue Type */}
              {issueType === "agent" && (
                <Box>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Describe the issue with the agent
                      </Text>
                      <Textarea
                        name="agentIssue"
                        value={formData.agentIssue}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Agent's name (if known)
                      </Text>
                      <Input
                        name="agentName"
                        value={formData.agentName || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Date of issue
                      </Text>
                      <Input
                        type="date"
                        name="agentIssueDate"
                        value={formData.agentIssueDate || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                  </VStack>
                </Box>
              )}

              {issueType === "property" && (
                <Box>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Describe the issue with the property or contractor
                      </Text>
                      <Textarea
                        name="propertyIssue"
                        value={formData.propertyIssue}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Property address or contractor's name
                      </Text>
                      <Input
                        name="propertyDetails"
                        value={formData.propertyDetails || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Date of issue
                      </Text>
                      <Input
                        type="date"
                        name="propertyIssueDate"
                        value={formData.propertyIssueDate || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                  </VStack>
                </Box>
              )}

              {issueType === "platform" && (
                <Box>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Describe the issue with the platform
                      </Text>
                      <Textarea
                        name="platformIssue"
                        value={formData.platformIssue}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Affected feature or section
                      </Text>
                      <Input
                        name="platformFeature"
                        value={formData.platformFeature || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Date of issue
                      </Text>
                      <Input
                        type="date"
                        name="platformIssueDate"
                        value={formData.platformIssueDate || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                  </VStack>
                </Box>
              )}

              {issueType === "other" && (
                <Box>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Please describe the issue in detail
                      </Text>
                      <Textarea
                        name="otherIssue"
                        value={formData.otherIssue}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                    <Box>
                      <Text mb={1} fontWeight="medium">
                        Date of issue
                      </Text>
                      <Input
                        type="date"
                        name="otherIssueDate"
                        value={formData.otherIssueDate || ""}
                        onChange={handleFormChange}
                        bg="white"
                      />
                    </Box>
                  </VStack>
                </Box>
              )}

              <Button colorScheme="blue" onClick={handleSubmit}>
                Submit Report
              </Button>
            </VStack>
          </Box>
        </Box>

        {/* Ticket Dialog */}
        <Dialog.Root
          key={dialogTicket?.id ?? 'no-ticket'}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
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
                          <Badge colorScheme={statusColor[dialogTicket.status] || "gray"}>
                            {dialogTicket.status}
                          </Badge>
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Last Update</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dialogTicket.lastUpdate
                            ? new Date(dialogTicket.lastUpdate).toLocaleString()
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
      </Flex>
    </Flex>
  );
}

export default Support;