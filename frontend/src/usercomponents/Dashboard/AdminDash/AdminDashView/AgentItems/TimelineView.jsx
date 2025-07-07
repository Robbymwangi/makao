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
  CloseButton,
} from "@chakra-ui/react";
import {
  CheckCircle,
  Clock,
  FileText,
  Plus,
} from "lucide-react";

// Mock projects (replace with real data/fetch)
const mockProjects = [
  {
    id: 1,
    name: "Park Avenue Residences",
    status: "In Progress",
    location: "123 Main St",
    timelines: [
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
    ],
  },
  {
    id: 2,
    name: "Oakwood Apartments",
    status: "Pending",
    location: "456 Oakwood Ave",
    timelines: [
      {
        id: 3,
        title: "Plumbing Installation",
        contractor: "PlumbPro Services",
        status: "in_progress",
        status_description: "70% completed",
        date: "2024-03-15",
        description: "Install main water supply lines",
      },
    ],
  },
];

const statusColorPalette = {
  completed: "green",
  pending: "yellow",
  in_progress: "blue",
};

const TimelineView = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
  const [selectedTimelineId, setSelectedTimelineId] = useState(null);
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTimeline, setNewTimeline] = useState({
    title: "",
    contractor: "",
    status: "pending",
    date: "",
    description: "",
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const timelines = selectedProject?.timelines || [];
  const selectedTimeline = timelines.find((t) => t.id === selectedTimelineId);

  const handleCheckoff = (timelineId) => {
    console.log("Status Updated for timeline:", timelineId);
    // Update the timeline status in the state
    setProjects(prev => 
      prev.map(project => ({
        ...project,
        timelines: project.timelines.map(timeline => 
          timeline.id === timelineId 
            ? { ...timeline, status: timeline.status === "completed" ? "pending" : "completed" }
            : timeline
        )
      }))
    );
  };

  const handleAddTimeline = () => {
    if (!newTimeline.title || !newTimeline.contractor || !newTimeline.date) {
      alert("Title, contractor, and date are required.");
      return;
    }
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              timelines: [
                ...project.timelines,
                {
                  ...newTimeline,
                  id: Math.max(0, ...project.timelines.map((t) => t.id)) + 1,
                },
              ],
            }
          : project
      )
    );
    
    // Reset form and close dialog
    setNewTimeline({
      title: "",
      contractor: "",
      status: "pending",
      date: "",
      description: "",
    });
    setShowAddTimeline(false);
    console.log("Timeline item added successfully");
  };

  const handleCloseDialog = () => {
    setShowAddTimeline(false);
    // Reset form when closing
    setNewTimeline({
      title: "",
      contractor: "",
      status: "pending",
      date: "",
      description: "",
    });
  };

  return (
    <Box>
      {/* Two-column layout */}
      <Flex h="400px" gap={4}>
        {/* Left: Project List */}
        <Box
          flex="1"
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
            <Heading size="md">My Projects</Heading>
          </HStack>
          <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto">
            {projects.map((project) => (
              <Box
                key={project.id}
                p={4}
                cursor="pointer"
                bg={selectedProjectId === project.id ? "blue.50" : "white"}
                _hover={{ bg: "gray.100" }}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setSelectedTimelineId(null);
                }}
                borderBottomWidth="1px"
                borderColor="gray.100"
              >
                <Text fontWeight="bold">{project.name}</Text>
                <Text fontSize="sm" color="gray.600">{project.location}</Text>
                <Badge colorScheme={project.status === "In Progress" ? "blue" : project.status === "Pending" ? "yellow" : "green"} mt={2}>
                  {project.status}
                </Badge>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Right: Timelines for selected project */}
        <Box
          flex="2"
          borderWidth="1px"
          borderRadius="lg"
          shadow="sm"
          p={0}
          display="flex"
          flexDirection="column"
          overflowY="auto"
          bg="white"
        >
          <Box p={6}>
            <HStack justify="space-between" mb={4}>
              <Heading size="lg">
                {selectedProject ? selectedProject.name : "Select a project"}
              </Heading>
              <Button
                leftIcon={<Plus size={18} />}
                colorScheme="blue"
                size="sm"
                onClick={() => setShowAddTimeline(true)}
              >
                Add Timeline Item
              </Button>
            </HStack>
            <VStack spacing={0} align="stretch">
              {timelines.length === 0 && (
                <Text color="gray.400" p={8} textAlign="center">
                  No timeline items for this project.
                </Text>
              )}
              {timelines.map((item) => (
                <Box
                  key={item.id}
                  p={4}
                  cursor="pointer"
                  bg={selectedTimelineId === item.id ? "blue.50" : "white"}
                  _hover={{ bg: "gray.100" }}
                  onClick={() => setSelectedTimelineId(item.id)}
                  borderBottomWidth="1px"
                  borderColor="gray.100"
                >
                  <HStack justify="space-between" mb={2}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold">{item.title}</Text>
                      <Text fontSize="sm" color="gray.600">{item.contractor}</Text>
                    </VStack>
                    <Badge colorScheme={statusColorPalette[item.status] || "gray"}>
                      {item.status.replace("_", " ")}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {item.description}
                  </Text>
                  <HStack justify="space-between" align="center">
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
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Flex>

      {/* Add Timeline Dialog - Fixed Modal Implementation */}
      {showAddTimeline && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          animation="fadeIn 0.2s ease-out"
          sx={{
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 }
            },
            '@keyframes slideIn': {
              from: { 
                opacity: 0,
                transform: 'translateY(-20px) scale(0.95)'
              },
              to: { 
                opacity: 1,
                transform: 'translateY(0) scale(1)'
              }
            }
          }}
        >
          <Box
            bg="white"
            borderRadius="lg"
            p={6}
            maxW="md"
            w="90%"
            maxH="90vh"
            overflowY="auto"
            position="relative"
            animation="slideIn 0.2s ease-out"
            boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Add Timeline Item</Heading>
              <CloseButton
                size="sm"
                onClick={handleCloseDialog}
              />
            </HStack>
            
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={1} fontWeight="medium">Title</Text>
                <Input
                  name="title"
                  value={newTimeline.title}
                  onChange={e =>
                    setNewTimeline(t => ({ ...t, title: e.target.value }))
                  }
                  placeholder="Timeline Title"
                  bg="white"
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="medium">Contractor</Text>
                <Input
                  name="contractor"
                  value={newTimeline.contractor}
                  onChange={e =>
                    setNewTimeline(t => ({ ...t, contractor: e.target.value }))
                  }
                  placeholder="Contractor"
                  bg="white"
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="medium">Date</Text>
                <Input
                  type="date"
                  name="date"
                  value={newTimeline.date}
                  onChange={e =>
                    setNewTimeline(t => ({ ...t, date: e.target.value }))
                  }
                  bg="white"
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="medium">Description</Text>
                <Textarea
                  name="description"
                  value={newTimeline.description}
                  onChange={e =>
                    setNewTimeline(t => ({ ...t, description: e.target.value }))
                  }
                  placeholder="Description"
                  bg="white"
                />
              </Box>
              <HStack pt={4} spacing={4}>
                <Button
                  onClick={handleCloseDialog}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTimeline}
                  size="sm"
                  colorScheme="blue"
                  isDisabled={
                    !newTimeline.title ||
                    !newTimeline.contractor ||
                    !newTimeline.date
                  }
                >
                  Save
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Timeline Item Details - full width, below */}
      <Box
        mt={6}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        p={6}
        minH="180px"
      >
        {selectedTimeline ? (
          <>
            <Heading size="md" mb={2}>{selectedTimeline.title}</Heading>
            <HStack mb={2}>
              <Badge colorScheme={statusColorPalette[selectedTimeline.status] || "gray"}>
                {selectedTimeline.status.replace("_", " ")}
              </Badge>
              <Text color="gray.500">{selectedTimeline.date}</Text>
            </HStack>
            <Text fontWeight="medium" mb={2}>Contractor: {selectedTimeline.contractor}</Text>
            <Text mb={2}>{selectedTimeline.description}</Text>
            {selectedTimeline.status_description && (
              <Text color="blue.500" mb={2}>{selectedTimeline.status_description}</Text>
            )}
            <HStack spacing={4} mt={4}>
              <Button
                leftIcon={<CheckCircle size={20} />}
                colorScheme={selectedTimeline.status === "completed" ? "green" : "gray"}
                variant="outline"
                onClick={() => handleCheckoff(selectedTimeline.id)}
              >
                {selectedTimeline.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
              </Button>
              <Button
                leftIcon={<FileText size={20} />}
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                  console.log("Submit Report clicked - Feature coming soon");
                }}
              >
                Submit Report
              </Button>
            </HStack>
          </>
        ) : (
          <Flex h="100%" align="center" justify="center" color="gray.400">
            <Text>Select a timeline item to view details</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default TimelineView;