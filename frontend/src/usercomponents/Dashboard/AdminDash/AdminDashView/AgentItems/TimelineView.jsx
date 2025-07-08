import React, { useState, useEffect, useRef } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import {
  CheckCircle,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient";

const statusColorPalette = {
  completed: "green",
  pending: "yellow",
  in_progress: "blue",
};

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/storage-upload";

const TimelineView = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTimelineId, setSelectedTimelineId] = useState(null);
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTimeline, setNewTimeline] = useState({
    title: "",
    contractor: "",
    status: "pending",
    date: "",
    description: "",
  });
  const [reportFiles, setReportFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTimelines, setLoadingTimelines] = useState(false);
  const [timelines, setTimelines] = useState([]);

  const fileInputRef = useRef();

  // Fetch projects assigned to this agent (similar to AssignedClients)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        // Get session and user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(`Failed to get session: ${sessionError.message}`);
        const user = session?.user;
        if (!user?.id) throw new Error("No user ID available");

        // Fetch projects where agent_id = user.id
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("agent_id", user.id);

        if (error) throw new Error(error.message);

        setProjects(data || []);
        if (data && data.length > 0) setSelectedProjectId(data[0].id);
      } catch (err) {
        toaster.create({
          title: "Error",
          description: err.message,
          type: "error",
        });
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch timelines for selected project
  useEffect(() => {
    if (!selectedProjectId) {
      setTimelines([]);
      return;
    }
    const fetchTimelines = async () => {
      setLoadingTimelines(true);
      try {
        const { data, error } = await supabase
          .from("project_timelines")
          .select("*")
          .eq("project_id", selectedProjectId)
          .order("date", { ascending: true });
        if (error) throw new Error(error.message);
        setTimelines(data || []);
      } catch (err) {
        toaster.create({
          title: "Error loading timelines",
          description: err.message,
          type: "error",
        });
        setTimelines([]);
      } finally {
        setLoadingTimelines(false);
      }
    };
    fetchTimelines();
  }, [selectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedTimeline = timelines.find((t) => t.id === selectedTimelineId);

  // Simulate upload and attach report to timeline
  const handleReportUpload = async (timelineId, file) => {
    setUploading(true);
    try {
      // 1. Get the current session and access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        toaster.create({
          title: "Upload failed",
          description: "Not authenticated.",
          type: "error",
        });
        setUploading(false);
        return;
      }
      const accessToken = session.access_token;

      // 2. Request a signed upload URL from the Edge Function
      const getUrlRes = await fetch(`${EDGE_URL}/get-upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          projectId: selectedProjectId,
          category: "reports", // Save under reports folder
        }),
      });
      const getUrlData = await getUrlRes.json();
      if (!getUrlRes.ok || !getUrlData.uploadUrl || !getUrlData.filePath || !getUrlData.fileUrl) {
        toaster.create({
          title: "Upload failed",
          description: getUrlData.error || "Could not get upload URL.",
          type: "error",
        });
        setUploading(false);
        return;
      }

      // 3. Upload the file to the signed URL
      const uploadRes = await fetch(getUrlData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!uploadRes.ok) {
        toaster.create({
          title: "Upload failed",
          description: "Failed to upload file to storage.",
          type: "error",
        });
        setUploading(false);
        return;
      }

      // 4. Notify the Edge Function to record the upload in the database
      const completeRes = await fetch(`${EDGE_URL}/upload-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          filePath: getUrlData.filePath,
          fileUrl: getUrlData.fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          projectId: selectedProjectId,
          category: "report", // file_category in DB
          description: `Report for timeline ${timelineId}`,
        }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok) {
        toaster.create({
          title: "Upload failed",
          description: completeData.error || "Failed to record file in database.",
          type: "error",
        });
        setUploading(false);
        return;
      }

      setReportFiles((prev) => ({
        ...prev,
        [timelineId]: {
          name: file.name,
          url: getUrlData.fileUrl,
        },
      }));

      toaster.create({
        title: "Report uploaded",
        type: "success",
      });
    } catch (err) {
      toaster.create({
        title: "Upload failed",
        description: err.message,
        type: "error",
      });
    }
    setUploading(false);
  };

  const handleCheckoff = async (timelineId) => {
    const hasReport = !!reportFiles[timelineId];
    const timeline = timelines.find((t) => t.id === timelineId);

    // Prevent marking as completed without a report, unless it's already completed and being reverted
    if (timeline.status !== "completed" && !hasReport) {
      toaster.create({
        title: "Attach a report before marking as completed.",
        type: "warning",
      });
      return;
    }

    const newStatus = timeline.status === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("project_timelines")
        .update({ status: newStatus })
        .eq("id", timelineId);

      if (error) {
        throw new Error(error.message);
      }

      setTimelines((prev) =>
        prev.map((timelineItem) =>
          timelineItem.id === timelineId
            ? {
                ...timelineItem,
                status: newStatus,
              }
            : timelineItem
        )
      );

      toaster.create({
        title: `Timeline item marked as ${newStatus}.`,
        type: "success",
      });
    } catch (err) {
      toaster.create({
        title: "Failed to update timeline status",
        description: err.message,
        type: "error",
      });
    }
  };


  const handleAddTimeline = async () => {
    if (!newTimeline.title || !newTimeline.contractor || !newTimeline.date) {
      toaster.create({
        title: "Title, contractor, and date are required.",
        type: "warning",
      });
      return;
    }
    const { data, error } = await supabase
      .from("project_timelines")
      .insert([{ ...newTimeline, project_id: selectedProjectId }])
      .select();
    if (error) {
      toaster.create({
        title: "Failed to add timeline",
        description: error.message,
        type: "error",
      });
      return;
    }
    setTimelines((prev) => [...prev, data[0]]);
    setNewTimeline({
      title: "",
      contractor: "",
      status: "pending",
      date: "",
      description: "",
    });
    setShowAddTimeline(false);
    toaster.create({
      title: "Timeline item added successfully",
      type: "success",
    });
  };

  const handleCloseDialog = () => {
    setShowAddTimeline(false);
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
            {loadingProjects ? (
              <Spinner m={8} />
            ) : projects.length === 0 ? (
              <Text color="gray.400" p={8} textAlign="center">
                No projects found.
              </Text>
            ) : (
              projects.map((project) => (
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
                  <Text fontWeight="bold">{project.name || project.project_name}</Text>
                  <Text fontSize="sm" color="gray.600">{project.location}</Text>
                  <Badge colorScheme={project.status === "In Progress" ? "blue" : project.status === "Pending" ? "yellow" : "green"} mt={2}>
                    {project.status}
                  </Badge>
                </Box>
              ))
            )}
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
                {selectedProject ? (selectedProject.name || selectedProject.project_name) : "Select a project"}
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
              {loadingTimelines ? (
                <Spinner m={8} />
              ) : timelines.length === 0 ? (
                <Text color="gray.400" p={8} textAlign="center">
                  No timeline items for this project.
                </Text>
              ) : (
                timelines.map((item) => (
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
                        {item.status?.replace("_", " ")}
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
                ))
              )}
            </VStack>
          </Box>
        </Box>
      </Flex>

      {/* Add Timeline Dialog */}
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

      {/* Timeline Item Details */}
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
                {selectedTimeline.status?.replace("_", " ")}
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
                isDisabled={
                  selectedTimeline.status !== "completed" && !reportFiles[selectedTimeline.id]
                }
              >
                {selectedTimeline.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
              </Button>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleReportUpload(selectedTimeline.id, file);
                  e.target.value = "";
                }}
              />
              <Button
                leftIcon={<FileText size={20} />}
                colorScheme={reportFiles[selectedTimeline.id] ? "green" : "blue"}
                variant="outline"
                isLoading={uploading}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                {reportFiles[selectedTimeline.id] ? "Report Attached" : "Submit Report"}
              </Button>
            </HStack>
            {reportFiles[selectedTimeline.id] && (
              <Text mt={2} fontSize="sm" color="green.600">
                Attached: {reportFiles[selectedTimeline.id].name}
              </Text>
            )}
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