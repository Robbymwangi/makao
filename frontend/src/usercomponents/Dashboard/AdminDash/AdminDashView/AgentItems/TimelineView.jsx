import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Flex,
  Heading,
  Badge,
  Input,
  Textarea,
  SimpleGrid,
  useBreakpointValue,
  IconButton,
  Menu,
  Portal,
} from "@chakra-ui/react";
import {
  CheckCircle,
  Clock,
  Plus,
  FileText,
  ChevronRight,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { toaster } from "@/components/ui/toaster";

// Mock data for timeline items
const initialTimelineItems = [
  {
    id: 1,
    title: "Foundation Inspection",
    contractor: "ABC Contractors",
    status: "pending",
    date: "2024-03-20",
    description: "Complete foundation inspection and submit report",
  },
  {
    id: 2,
    title: "Electrical Wiring Phase 1",
    contractor: "ElectriCo Ltd",
    status: "completed",
    date: "2024-03-18",
    description: "Install main electrical wiring in ground floor",
  },
  {
    id: 3,
    title: "Plumbing Installation",
    contractor: "PlumbPro Services",
    status: "in_progress",
    status_description: "70% completed",
    date: "2024-03-15",
    description: "Install main water supply lines",
  },
];

const TimelineView = () => {
  const [timelineItems, setTimelineItems] = useState(initialTimelineItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleCheckoff = (itemId) => {
    setTimelineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: item.status === "completed" ? "pending" : "completed" }
          : item
      )
    );
    toaster.create({
      title: "Status Updated",
      description: "Timeline item status has been updated",
      type: "success",
    });
  };

  const handleSubmitReport = () => {
    setIsSubmittingReport(true);
    // Simulate report submission
    setTimeout(() => {
      setIsSubmittingReport(false);
      toaster.create({
        title: "Report Submitted",
        description: "Your report has been successfully submitted",
        type: "success",
      });
    }, 2000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: "green", text: "Completed" },
      pending: { color: "yellow", text: "Pending" },
      in_progress: { color: "blue", text: "In Progress" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge colorScheme={config.color} variant="subtle">
        {config.text}
      </Badge>
    );
  };

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Timeline Items Section */}
        <Box>
          <HStack justify="space-between" mb={6}>
            <Heading size="lg">Timeline Items</Heading>
            <Button
              leftIcon={<Plus size={20} />}
              colorScheme="blue"
              onClick={() => {
                toaster.create({
                  title: "Add Item",
                  description: "Feature coming soon",
                  type: "info",
                });
              }}
            >
              Add Item
            </Button>
          </HStack>

          <VStack spacing={4} align="stretch">
            {timelineItems.map((item) => (
              <Box
                key={item.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                bg="white"
              >
                <HStack justify="space-between" mb={2}>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="semibold">
                      {item.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.contractor}
                    </Text>
                  </VStack>
                  {getStatusBadge(item.status)}
                </HStack>

                <Text fontSize="sm" color="gray.600" mb={3}>
                  {item.description}
                </Text>

                <HStack justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Text fontSize="sm" color="gray.500">
                      <Clock size={16} style={{ display: "inline", marginRight: "4px" }} />
                      {item.date}
                    </Text>
                    {item.status_description && (
                      <Text fontSize="sm" color="blue.500">
                        {item.status_description}
                      </Text>
                    )}
                  </HStack>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<CheckCircle size={20} />}
                      variant="ghost"
                      colorScheme={item.status === "completed" ? "green" : "gray"}
                      onClick={() => handleCheckoff(item.id)}
                      aria-label="Check off item"
                    />
                    <IconButton
                      icon={<FileText size={20} />}
                      variant="ghost"
                      onClick={() => setSelectedItem(item)}
                      aria-label="Submit report"
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Report Submission Section */}
        <Box>
          <Heading size="lg" mb={6}>Submit Report</Heading>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            bg="white"
          >
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2} fontWeight="medium">Title</Text>
                <Input placeholder="Report title" />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Description</Text>
                <Textarea
                  placeholder="Detailed report description"
                  rows={4}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Related Timeline Item</Text>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="outline"
                      w="100%"
                      justifyContent="space-between"
                      rightIcon={<ChevronRight size={20} />}
                    >
                      {selectedItem ? selectedItem.title : "Select item"}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content minW="200px">
                        {timelineItems.map((item) => (
                          <Menu.Item
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                          >
                            {item.title}
                          </Menu.Item>
                        ))}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>

              <Box
                borderWidth="2px"
                borderStyle="dashed"
                borderRadius="md"
                p={6}
                textAlign="center"
                borderColor="gray.300"
                bg="gray.50"
                _hover={{ borderColor: "blue.500", cursor: "pointer" }}
              >
                <VStack spacing={2}>
                  <Upload size={24} />
                  <Text fontWeight="medium">
                    Drop files here or click to upload
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX
                  </Text>
                </VStack>
              </Box>

              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSubmitReport}
                isLoading={isSubmittingReport}
                loadingText="Submitting..."
              >
                Submit Report
              </Button>
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default TimelineView;