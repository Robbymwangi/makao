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
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient"; // Use supabase client for session

// Allowed types for each section
const allowedTypes = {
  report: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg"
  ],
  photos: [
    "image/png",
    "image/jpeg",
    "image/jpg"
  ],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]
};
const maxSize = 10 * 1024 * 1024; // 10MB

// Example upload handler for a single file
async function handleFileUpload(file, category, projectId, accessToken) {
  // 1. Get a signed upload URL
  const uploadUrlRes = await fetch(
    "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/storage-upload/get-upload-url",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        category, // use 'photo', 'document', etc.
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    }
  );
  const uploadUrlData = await uploadUrlRes.json();
  if (!uploadUrlRes.ok) throw new Error(uploadUrlData.error);

  // 2. Upload the file to the signed URL
  await fetch(uploadUrlData.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  // 3. Register the file in the database (upload-complete)
  const registerRes = await fetch(
    "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/storage-upload/upload-complete",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        category,
        filePath: uploadUrlData.filePath,
        fileUrl: uploadUrlData.fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        description: "",
      }),
    }
  );
  const registerData = await registerRes.json();
  if (!registerRes.ok) throw new Error(registerData.error);

  return registerData.file;
}

// Reusable Upload Section
const UploadSection = ({
  title,
  description,
  acceptTypes,
  maxFiles,
  files,
  setFiles,
  errors,
  setErrors,
  isSubmitting,
  setIsSubmitting,
  fileUploadKey,
  setFileUploadKey,
  onUploadSuccess
}) => {
  const { id: projectId } = useParams();

  const handleFileChange = (acceptedFiles) => {
    setFiles(acceptedFiles);
    if (acceptedFiles?.length > 0) {
      setErrors((prev) => ({ ...prev, documents: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!files || files.length === 0) {
      errs.documents = `At least one ${title.toLowerCase()} is required.`;
    } else {
      if (files.length > maxFiles) {
        errs.documents = `You can upload a maximum of ${maxFiles} files.`;
      } else {
        for (const file of files) {
          if (!acceptTypes.includes(file.type)) {
            errs.documents = `Only ${acceptTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} files are allowed.`;
            break;
          }
          if (file.size > maxSize) {
            errs.documents = "Each file must not exceed 10MB.";
            break;
          }
        }
      }
    }
    setErrors(errs);
    return errs;
  };

  const handleSubmit = async (e) => {
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
      // Get latest access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error("No access token found");

      // Determine category for upload
      let category = "report";
      if (title.toLowerCase().includes("photo")) category = "photo";
      else if (title.toLowerCase().includes("document")) category = "document";

      // Upload each file using your real upload logic
      for (const file of files) {
        await handleFileUpload(file, category, projectId, accessToken);
      }

      toaster.create({
        description: `Your ${title.toLowerCase()} has been uploaded successfully.`,
        type: "success",
        duration: 4000,
      });
      onUploadSuccess(files);
      setFiles([]);
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

  return (
    <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" as="form" onSubmit={handleSubmit} mb={6}>
      <Heading size="xl" mb={4}>{title}</Heading>
      <VStack spacing={4} align="stretch">
        <Text fontSize="sm" color="gray.500">{description}</Text>
        <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={maxFiles} key={fileUploadKey}>
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone>
            <Icon as={LuUpload} boxSize={8} color="gray.400" />
            <FileUpload.DropzoneContent>
              <Box>Drag and drop files here, or click to select</Box>
              <Box color="gray.400">{acceptTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} up to 10MB</Box>
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
          {errors.documents && (<Text color="red.500" fontSize="sm" mt={2}>{errors.documents}</Text>)}
        </FileUpload.Root>
        <Button type="submit" alignSelf="flex-start" isLoading={isSubmitting} disabled={isSubmitting || files.length === 0}>
          {isSubmitting ? "Submitting..." : `Submit ${title}`}
        </Button>
      </VStack>
    </Box>
  );
};

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/get-project-details";

const MyProjects = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileUploads, setFileUploads] = useState([]);
  const [filter, setFilter] = useState("All");

  // State for the report upload section
  const [reportFiles, setReportFiles] = useState([]);
  const [reportErrors, setReportErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(Date.now());
  const [handoffOpen, setHandoffOpen] = useState(false);

  // Add state for photos and documents
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoErrors, setPhotoErrors] = useState({});
  const [isPhotoSubmitting, setIsPhotoSubmitting] = useState(false);
  const [photoUploadKey, setPhotoUploadKey] = useState(Date.now());

  const [docFiles, setDocFiles] = useState([]);
  const [docErrors, setDocErrors] = useState({});
  const [isDocSubmitting, setIsDocSubmitting] = useState(false);
  const [docUploadKey, setDocUploadKey] = useState(Date.now());

  // Fetch project data based on the ID and latest access token
  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      // Get the latest session and access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${EDGE_URL}?id=${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      setProject(data.project || null);
      setLoading(false);
    }
    if (id) fetchProject();
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

  // Add uploaded files to the "Project Documents" list for display
  const handleReportUploadSuccess = (files) => {
    const newUploads = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      source: "You",
      date: new Date().toLocaleDateString(),
    }));
    setFileUploads(prev => [...prev, ...newUploads]);
  };
  const handlePhotoUploadSuccess = (files) => {
    const newUploads = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      source: "You (Photo)",
      date: new Date().toLocaleDateString(),
    }));
    setFileUploads(prev => [...prev, ...newUploads]);
  };
  const handleDocUploadSuccess = (files) => {
    const newUploads = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      source: "You (Document)",
      date: new Date().toLocaleDateString(),
    }));
    setFileUploads(prev => [...prev, ...newUploads]);
  };

  if (loading) {
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

  if (!project) {
    return <Text>Project not found or you do not have access.</Text>;
  }

  return (
    <VStack spacing={6} align="stretch">
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

      {/* Handoff Project Button */}
      <Flex justify={{ base: "center", md: "flex-start" }} mb={2}>
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

      
      {/* Project Card with actual location and status */}
      <Card.Root w="100%" position="relative" mt={10} borderRadius="lg" overflow="hidden">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
          alt={project.name}
          objectFit="cover"
          w="100%"
          h="300px"
        />
        <Box
          p={6}
          position="absolute"
          bottom="0"
          left="0"
          color="white"
          bg="rgba(0, 0, 0, 0.6)"
          w="100%"
          borderBottomRadius="lg"
        >
          <Text fontSize="lg" fontWeight="bold" mb={2}>{project.name}</Text>
          <Text fontSize="md" color="gray.300" mb={4}>
            {project.location || 'No location specified'}
          </Text>
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
        <Box w={{ base: "100%", md: "80%" }}>
          {/* Upload Project Photos */}
          <UploadSection
            title="Upload Project Photos"
            description="Upload up to 5 project photos. Accepted formats: JPG, PNG. Max size: 10MB each."
            acceptTypes={allowedTypes.photos}
            maxFiles={5}
            files={photoFiles}
            setFiles={setPhotoFiles}
            errors={photoErrors}
            setErrors={setPhotoErrors}
            isSubmitting={isPhotoSubmitting}
            setIsSubmitting={setIsPhotoSubmitting}
            fileUploadKey={photoUploadKey}
            setFileUploadKey={setPhotoUploadKey}
            onUploadSuccess={handlePhotoUploadSuccess}
          />
          {/* Upload Project Documents */}
          <UploadSection
            title="Upload Project Documents"
            description="Please upload up to 5 report documents. Accepted formats: PDF, DOCX. Max size: 10MB each."
            acceptTypes={allowedTypes.documents}
            maxFiles={5}
            files={docFiles}
            setFiles={setDocFiles}
            errors={docErrors}
            setErrors={setDocErrors}
            isSubmitting={isDocSubmitting}
            setIsSubmitting={setIsDocSubmitting}
            fileUploadKey={docUploadKey}
            setFileUploadKey={setDocUploadKey}
            onUploadSuccess={handleDocUploadSuccess}
          />
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
    </VStack>
  );
};

export default MyProjects;