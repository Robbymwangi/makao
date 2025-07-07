"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Heading,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  Image,
  Timeline,
  Stack,
  CloseButton,
  Dialog,
  Portal,
  ProgressCircle,
  Icon,
  FileUpload,
} from "@chakra-ui/react";
import { ChevronRight, FileText, Construction, Check, Package, Ship, Upload } from "lucide-react";
import { LuUpload } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster"; // Assuming toaster is in this path

// Define file constraints
const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg"
];
const maxSize = 10 * 1024 * 1024; // 10MB

const MyProjects = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [fileUploads, setFileUploads] = useState([]); // For the bottom section
  const [filter, setFilter] = useState("All");

  // State for the report upload section
  const [reportFiles, setReportFiles] = useState([]);
  const [reportErrors, setReportErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(Date.now());
  const [handoffOpen, setHandoffOpen] = useState(false);

  // Simulate fetching project data based on the ID
  useEffect(() => {
    const projects = [
      { id: 1, name: "Residential Casa du Panel", description: "A modern residential project." },
      { id: 2, name: "Urban Skyline Apartments", description: "Luxury apartments in the city." },
    ];
    const selectedProject = projects.find((p) => String(p.id) === String(id));
    setProject(selectedProject);
  }, [id]);

  // Demo milestones
  const milestonesData = [
    { id: 1, phase: "Phase 1 Started", date: "21st February 2023", description: "Initial phase of the project began with planning and design.", icon: Ship },
    { id: 2, phase: "Phase 1 Completed", date: "4th April 2023", description: "Phase 1 completed with 70% progress achieved.", icon: Check },
    { id: 3, phase: "Next Phase Preparation", date: "Ongoing", description: "Preparing for the next phase of the project.", icon: Package },
  ];

  const filteredMilestones =
    filter === "All"
      ? milestonesData
      : milestonesData.filter((milestone) =>
          milestone.phase.toLowerCase().includes(filter.toLowerCase())
        );

  const handleFileChange = (acceptedFiles) => {
    setReportFiles(acceptedFiles);
    if (acceptedFiles?.length > 0) {
      setReportErrors((prev) => ({ ...prev, documents: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!reportFiles || reportFiles.length === 0) {
      errs.documents = "At least one project report is required.";
    } else {
      if (reportFiles.length > 5) {
        errs.documents = "You can upload a maximum of 5 files.";
      } else {
        for (const file of reportFiles) {
          if (!allowedTypes.includes(file.type)) {
            errs.documents = "Only PDF, DOCX, PNG, and JPG files are allowed.";
            break;
          }
          if (file.size > maxSize) {
            errs.documents = "Each file must not exceed 10MB.";
            break;
          }
        }
      }
    }
    setReportErrors(errs);
    return errs;
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      toaster.create({
        description: Object.values(errs)[0],
        type: "error",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Uploading files:", reportFiles.map(f => f.name));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toaster.create({
        description: "Your project report has been uploaded successfully.",
        type: "success",
        duration: 4000,
      });
      
      // Add the uploaded files to the "Project Documents" list for display
      const newUploads = reportFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        source: "You",
        date: new Date().toLocaleDateString(),
      }));
      setFileUploads(prev => [...prev, ...newUploads]);

      setReportFiles([]);
      setFileUploadKey(Date.now());
    } catch (error) {
      toaster.create({
        description: error.message || "An unexpected error occurred.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return (
      <VStack spacing={4} align="center" justify="center" minH="300px">
        <ProgressCircle.Root value={null} size="md" aria-label="Loading project details">
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <Text>Loading project details...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Handoff Project Button */}
      <Flex justify="flex-end">
        <Dialog.Root
          open={handoffOpen}
          onOpenChange={(open) => setHandoffOpen(open)}
        >
          <Dialog.Trigger asChild>
            <Button colorScheme="red" variant="outline" size="sm">
              Mark Project as Finished
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Mark Project as Finished?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text color="red.500" fontWeight="bold" mb={2}>
                    Warning: This action will mark the project as finished and hand it off. You will no longer be able to upload new reports or make changes.
                  </Text>
                  <Text>
                    Are you sure you want to continue? This cannot be undone.
                  </Text>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button colorScheme="red" ml={2} onClick={() => {
                    setHandoffOpen(false);
                    toaster.create({
                      description: "Project marked as finished.",
                      type: "success",
                      duration: 4000,
                    });
                  }}>
                    Confirm &amp; Finish
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Flex>

      <Breadcrumb.Root mb={2}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/admin-dashboard/projects">My Projects</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>{project.name}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <Heading>{project.name}</Heading>
      <Text>{project.description}</Text>

      <Card.Root w="100%" position="relative" mt={10} borderRadius="lg" overflow="hidden">
        <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" alt={project.name} objectFit="cover" w="100%" h="300px" />
        <Box p={6} position="absolute" bottom="0" left="0" color="white" bg="rgba(0, 0, 0, 0.6)" w="100%" borderBottomRadius="lg">
          <Text fontSize="lg" fontWeight="bold" mb={2}>{project.name}</Text>
          <Text fontSize="md" color="gray.300" mb={4}>Madrid, Lisbon</Text>
          <Stack direction="row" spacing={2} mb={4}>
            <Badge colorPalette="green" fontSize="sm"><Construction /> Ongoing</Badge>
            <Badge colorPalette="blue" fontSize="sm"><Check /> On Track</Badge>
          </Stack>
        </Box>
      </Card.Root>

      {/* Milestones Section */}
      <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" mb={6} mt={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="xl">Milestones</Heading>
          <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm">View Full Timeline</Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Project Timeline</Dialog.Title>
                    <Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Box mb={4}>
                      <Button size="sm" variant={filter === "All" ? "solid" : "outline"} onClick={() => setFilter("All")} mr={2}>All</Button>
                      <Button size="sm" variant={filter === "Phase 1" ? "solid" : "outline"} onClick={() => setFilter("Phase 1")}>Phase 1</Button>
                    </Box>
                    <Timeline.Root>
                      {filteredMilestones.map((milestone) => (
                        <Timeline.Item key={milestone.id}>
                          <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator><milestone.icon /></Timeline.Indicator>
                          </Timeline.Connector>
                          <Timeline.Content>
                            <Timeline.Title>{milestone.phase}</Timeline.Title>
                            <Timeline.Description>{milestone.date}</Timeline.Description>
                            <Text textStyle="sm">{milestone.description}</Text>
                          </Timeline.Content>
                        </Timeline.Item>
                      ))}
                    </Timeline.Root>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
        <Box maxH="300px" overflowY="auto" pr={2}>
          <Timeline.Root>
            {milestonesData.map((milestone) => (
              <Timeline.Item key={milestone.id}>
                <Timeline.Connector>
                  <Timeline.Separator />
                  <Timeline.Indicator><milestone.icon /></Timeline.Indicator>
                </Timeline.Connector>
                <Timeline.Content>
                  <Timeline.Title>{milestone.phase}</Timeline.Title>
                  <Timeline.Description>{milestone.date}</Timeline.Description>
                  <Text textStyle="sm">{milestone.description}</Text>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline.Root>
        </Box>
      </Box>

      {/* Report Upload & Personnel Section */}
      <Flex w="100%" gap={4} flexDirection={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: "80%" }} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" as="form" onSubmit={handleReportSubmit}>
          <Heading size="xl" mb={4}>Upload Project Report</Heading>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.500">
              Please upload up to 5 report documents.<br />
              Accepted formats: PDF, DOCX, JPG, PNG. Max size: 10MB each.
            </Text>
            <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={5} key={fileUploadKey}>
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone>
                <Icon as={LuUpload} boxSize={8} color="gray.400" />
                <FileUpload.DropzoneContent>
                  <Box>Drag and drop files here, or click to select</Box>
                  <Box color="gray.400">.pdf, .docx, .png, .jpg up to 10MB</Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.ItemGroup mt={2}>
                <FileUpload.Context>
                  {({ acceptedFiles }) => {
                    useEffect(() => {
                      handleFileChange(acceptedFiles);
                    }, [acceptedFiles]);
                    return acceptedFiles.map((file, index) => (
                      <FileUpload.Item key={index} file={file}>
                        <HStack spacing={2} p={2} borderWidth="1px" borderColor="gray.200" borderRadius="md" justifyContent="space-between" alignItems="center" width="100%" bg="white">
                          <HStack spacing={2} flex="1">
                            <Icon as={FileText} boxSize={4} color="gray.600" />
                            <Box fontSize="sm" isTruncated flex="1">{file.name}</Box>
                          </HStack>
                          <FileUpload.ItemDeleteTrigger asChild>
                            <CloseButton size="sm" aria-label={`Remove file ${file.name}`} />
                          </FileUpload.ItemDeleteTrigger>
                        </HStack>
                      </FileUpload.Item>
                    ));
                  }}
                </FileUpload.Context>
              </FileUpload.ItemGroup>
              {reportErrors.documents && (<Text color="red.500" fontSize="sm" mt={2}>{reportErrors.documents}</Text>)}
            </FileUpload.Root>
            <Button type="submit" alignSelf="flex-start" isLoading={isSubmitting} disabled={isSubmitting || reportFiles.length === 0}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </VStack>
        </Box>

        <Box w={{ base: "100%", md: "20%" }} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Heading size="lg" mb={4}>Personnel Details</Heading>
          <Avatar.Root>
            <Avatar.Fallback name="Metano Construction" />
            <Avatar.Image src="https://via.placeholder.com/150" />
          </Avatar.Root>
          <Text fontSize="lg" fontWeight="bold" mt={4}>Metano Construction</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>Current Contractor</Text>
          <Box mt={6} textAlign="center">
            <Avatar.Root>
              <Avatar.Fallback name="Jane Smith" />
              <Avatar.Image src="https://via.placeholder.com/150" />
            </Avatar.Root>
            <Text fontSize="lg" fontWeight="bold" mt={4}>Jane Smith</Text>
            <Text fontSize="sm" color="gray.500" mt={2}>Agent ID: 123456</Text>
          </Box>
        </Box>
      </Flex>

      {/* Project Documents Section */}
      <Box>
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="xl">Project Documents</Heading>
          </Flex>
          {fileUploads.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {fileUploads.map((file) => (
                <Box key={file.id} p={3} borderWidth="1px" borderRadius="md" _hover={{ bg: "gray.50" }}>
                  <HStack spacing={4} align="center">
                    <FileText size={20} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">{file.name}</Text>
                      <Text fontSize="xs" color="gray.500">Sent by {file.source}</Text>
                    </VStack>
                    <Text fontSize="xs" color="gray.500" ml="auto">{file.date}</Text>
                  </HStack>
                </Box>
              ))}
              <Button size="sm" rightIcon={<ChevronRight size={16} />} alignSelf="flex-end">
                See all files
              </Button>
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">No files uploaded yet.</Text>
          )}
        </Box>
      </Box>
    </VStack>
  );
};

export default MyProjects;