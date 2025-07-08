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
import supabase from "@/utils/supabaseClient";

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

async function handleFileUpload(file, category, projectId, accessToken) {
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
        category,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    }
  );
  const uploadUrlData = await uploadUrlRes.json();
  if (!uploadUrlRes.ok) throw new Error(uploadUrlData.error);

  await fetch(uploadUrlData.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

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
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error("No access token found");

      let category = "report";
      if (title.toLowerCase().includes("photo")) category = "photo";
      else if (title.toLowerCase().includes("document")) category = "document";

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

const statusIconMap = {
  completed: Check,
  pending: Package,
  in_progress: Ship,
  default: Construction,
};

const MyProjects = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [fileUploads, setFileUploads] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [filter, setFilter] = useState("All");

  const [reportFiles, setReportFiles] = useState([]);
  const [reportErrors, setReportErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(Date.now());
  const [handoffOpen, setHandoffOpen] = useState(false);

  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoErrors, setPhotoErrors] = useState({});
  const [isPhotoSubmitting, setIsPhotoSubmitting] = useState(false);
  const [photoUploadKey, setPhotoUploadKey] = useState(Date.now());

  const [docFiles, setDocFiles] = useState([]);
  const [docErrors, setDocErrors] = useState({});
  const [isDocSubmitting, setIsDocSubmitting] = useState(false);
  const [docUploadKey, setDocUploadKey] = useState(Date.now());

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${EDGE_URL}?id=${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      setProject(data.project || {});
      setLoading(false);
    }
    if (id) fetchProject();
  }, [id]);

  useEffect(() => {
    async function fetchTimelines() {
      if (!id) return;
      const { data, error } = await supabase
        .from("project_timelines")
        .select("*")
        .eq("project_id", id)
        .order("date", { ascending: true });
      if (!error) setTimelines(data || []);
    }
    fetchTimelines();
  }, [id]);

  const uniquePhases = Array.from(new Set(timelines.map(t => t.title))).filter(Boolean);

  const filteredMilestones =
    filter === "All"
      ? timelines
      : timelines.filter((milestone) => milestone.title === filter);

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

  // Updated: Use Supabase directly to update progress_status
  const handleToggleProgressStatus = async () => {
    const newStatus = project.progress_status === "completed" ? "in_progress" : "completed";
    const { error } = await supabase
      .from("projects")
      .update({ progress_status: newStatus })
      .eq("id", project.id);

    if (!error) {
      setProject((prev) => ({ ...prev, progress_status: newStatus }));
      setHandoffOpen(false);
      toaster.create({
        title: `Project marked as ${newStatus.replace("_", " ")}`,
        type: "success",
      });
    } else {
      toaster.create({
        title: "Failed to update project status",
        description: error.message,
        type: "error",
      });
    }
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
        <Dialog.Root open={handoffOpen} onOpenChange={setHandoffOpen}>
          <Dialog.Trigger asChild>
            <Button
              colorScheme={project.progress_status === "completed" ? "yellow" : "red"}
              variant="outline"
              size="sm"
              isDisabled={project.status !== "approved"}
            >
              {project.progress_status === "completed"
                ? "Revert to In Progress"
                : "Mark Project as Finished"}
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>
                    {project.progress_status === "completed"
                      ? "Revert Project to In Progress?"
                      : "Mark Project as Finished?"}
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text color="red.500" fontWeight="bold" mb={2}>
                    {project.progress_status === "completed"
                      ? "This will allow you to add new timelines and reports again."
                      : "Warning: This action will mark the project as finished and hand it off. You will no longer be able to upload new reports or make changes."}
                  </Text>
                  <Text>
                    Are you sure you want to continue? 
                  </Text>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button variant="outline" onClick={() => setHandoffOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme={project.progress_status === "completed" ? "yellow" : "red"}
                    ml={2}
                    onClick={handleToggleProgressStatus}
                  >
                    {project.progress_status === "completed"
                      ? "Revert to In Progress"
                      : "Confirm & Finish"}
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={() => setHandoffOpen(false)} />
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
                      <Button
                        size="sm"
                        variant={filter === "All" ? "solid" : "outline"}
                        onClick={() => setFilter("All")}
                        mr={2}
                      >
                        All
                      </Button>
                      {uniquePhases.map((phase) => (
                        <Button
                          key={phase}
                          size="sm"
                          variant={filter === phase ? "solid" : "outline"}
                          onClick={() => setFilter(phase)}
                          mr={2}
                        >
                          {phase}
                        </Button>
                      ))}
                    </Box>
                    <Timeline.Root>
                      {filteredMilestones.map((milestone) => {
                        const IconComponent = statusIconMap[milestone.status] || statusIconMap.default;
                        return (
                          <Timeline.Item key={milestone.id}>
                            <Timeline.Connector>
                              <Timeline.Separator />
                              <Timeline.Indicator><IconComponent /></Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content>
                              <Timeline.Title>{milestone.title}</Timeline.Title>
                              {filter === "All" ? (
                                <Text textStyle="sm">{milestone.description}</Text>
                              ) : (
                                <>
                                  <Timeline.Description>
                                    Created: {milestone.date}
                                    <br />
                                    {milestone.completed_at && (
                                      <>Completed: {milestone.completed_at}<br /></>
                                    )}
                                    Estimated Cost: {milestone.estimated_cost ? `Ksh ${milestone.estimated_cost}` : "N/A"}
                                    <br />
                                    Actual Expenditure: {milestone.actual_expenditure ? `Ksh ${milestone.actual_expenditure}` : "N/A"}
                                  </Timeline.Description>
                                  <Text textStyle="sm">{milestone.description}</Text>
                                </>
                              )}
                            </Timeline.Content>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline.Root>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
        <Box maxH="300px" overflowY="auto" pr={2}>
          <Timeline.Root>
            {timelines.map((milestone) => {
              const IconComponent = statusIconMap[milestone.status] || statusIconMap.default;
              return (
                <Timeline.Item key={milestone.id}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator><IconComponent /></Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>{milestone.title}</Timeline.Title>
                    <Timeline.Description>{milestone.date}</Timeline.Description>
                    <Text textStyle="sm">{milestone.description}</Text>
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline.Root>
        </Box>
      </Box>

      {/* Report Upload & Photos/Documents Section */}
      <Flex w="100%" gap={4} flexDirection={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: "50%" }}>
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
        </Box>
        <Box w={{ base: "100%", md: "50%" }}>
          <UploadSection
            title="Upload Project Documents"
            description="Please upload up to 5 project documents. Accepted formats: PDF, DOCX. Max size: 10MB each."
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
      </Flex>
    </VStack>
  );
};

export default MyProjects;