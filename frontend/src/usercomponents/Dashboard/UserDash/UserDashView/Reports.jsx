import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Dialog,
  VStack,
  Spinner,
  SimpleGrid,
  HStack,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Folder,
  File,
  Image as LucideImage,
  LayoutGrid,
  List,
} from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/store/useAuthStore";
import ProjectApprovalForm from "@/usercomponents/Dashboard/UserDash/UserDashComponents/ProjectsComponents/ProjectApprovalForm";
import supabase from "@/utils/supabaseClient";

function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms)),
  ]);
}

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/check-user-projects";

const initialFolders = [
  { id: 1, name: "Tech Innovations" },
  { id: 2, name: "Digital Masterpieces" },
  { id: 3, name: "Software Solutions" },
  { id: 4, name: "Code Inspirations" },
];

const Reports = () => {
  const [fileView, setFileView] = useState("grid");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = useAuthStore((state) => state.user);
  const jwt = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [userRole, setUserRole] = useState("user");
  const [projectFiles, setProjectFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [projectFolders, setProjectFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  useEffect(() => {
    async function checkUserProjects() {
      setLoading(true);
      try {
        if (!jwt) {
          setShowSubmissionOverlay(false);
          setLoading(false);
          return;
        }
        const res = await fetch(EDGE_URL, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!res.ok) {
          setShowSubmissionOverlay(false);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
        setUserProjects(data.existingProjects || []);
        setUserRole(data.userRole || "user");
      } catch (error) {
        setShowSubmissionOverlay(false);
      } finally {
        setLoading(false);
      }
    }
    if (user && jwt) {
      checkUserProjects();
    } else {
      setLoading(false);
    }
  }, [user, jwt]);

  // Fetch projects as folders
  useEffect(() => {
    const fetchFolders = async () => {
      if (!user || !jwt) return;
      try {
        const { data: projects, error } = await supabase
          .from("projects")
          .select("id, project_name")
          .eq("client_id", user.id);

        if (error || !projects) {
          setProjectFolders([]);
          return;
        }
        // Each project is a folder
        setProjectFolders(projects.map(p => ({
          id: p.id,
          name: p.project_name,
        })));
      } catch (e) {
        setProjectFolders([]);
      }
    };
    fetchFolders();
  }, [user, jwt]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user || !jwt) return;
      setFilesLoading(true);
      try {
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id")
          .eq("client_id", user.id);

        if (projectsError || !projects || projects.length === 0) {
          setProjectFiles([]);
          setFilesLoading(false);
          return;
        }

        const projectIds = projects.map((p) => p.id);

        const { data: files, error: filesError } = await supabase
          .from("project_files")
          .select("id, project_id, file_name, file_type, file_category, file_url, uploaded_at")
          .in("project_id", projectIds);

        if (filesError || !files) {
          setProjectFiles([]);
          setFilesLoading(false);
          return;
        }

        setProjectFiles(files);
      } catch (e) {
        setProjectFiles([]);
      } finally {
        setFilesLoading(false);
      }
    };
    fetchFiles();
  }, [user, jwt]);

  const handleFormSubmit = async (formData) => {
    try {
      if (!jwt) return;
      await submitProjectApproval(jwt, formData);
      setIsFormOpen(false);
      setLoading(true);
      const res = await fetch(EDGE_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
      setUserProjects(data.existingProjects || []);
      setUserRole(data.userRole || "user");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    toaster.create({ description: `Clicked: ${item.name}`, type: "info" });
  };

  const foldersListView = isMobile;
  const filesListView = isMobile ? fileView === "list" || true : fileView === "list";

  // Filter files for selected folder/project
  const visibleFiles = selectedFolderId
    ? projectFiles.filter((file) => file.project_id === selectedFolderId)
    : [];

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="100vh" textAlign="center" p={8}>
        <Spinner size="xl" color="black" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  if (showSubmissionOverlay) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="100vh" textAlign="center" p={8}>
        <Box maxW="lg" width="100%">
          <Text as="h2" fontSize="2xl" fontWeight="bold" mb={2} color="gray.800">
            Project Approval
          </Text>
          <Text fontSize="lg" color="gray.700" mb={4}>
            Please fill in your project details below to request approval and gain full access to the platform. All information will be reviewed by our team.
          </Text>
        </Box>
        <Button colorScheme="blue" mt={4} onClick={() => setIsFormOpen(true)}>
          Submit Project Details
        </Button>
        <Dialog.Root open={isFormOpen} onOpenChange={(details) => setIsFormOpen(details.open)}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="lg">
              <Dialog.Header>
                <Dialog.Title>Submit Project Details</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <Button onClick={() => setIsFormOpen(false)}>Close</Button>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <ProjectApprovalForm loading={loading} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Heading size="4xl" fontWeight="bold" mb={8} fontFamily="'Playfair Display', serif" letterSpacing="tight" color="gray.800" textAlign={{ base: "center", lg: "left" }}>
        Reports
      </Heading>

      {!selectedFolderId && (
        <>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="lg" fontWeight="semibold" mb={4}>
              Your Projects
            </Heading>
            <Button size="sm" variant="outline" colorScheme="blue" onClick={() => toaster.create({ description: "View all folders clicked", type: "info" })}>
              View All
            </Button>
          </HStack>

          {foldersListView ? (
            <VStack spacing={4} align="stretch" mb={10}>
              {projectFolders.map((folder) => (
                <HStack key={folder.id} p={4} bg="white" borderRadius="md" boxShadow="sm" transition="all 0.2s" _hover={{ boxShadow: "lg", cursor: "pointer", transform: "translateY(-2px) scale(1.03)", zIndex: 1 }} spacing={4} align="center">
                  <Box bg="gray.100" borderRadius="md" p={2} display="flex" alignItems="center" justifyContent="center">
                    <LucideImage size={32} color="#A0AEC0" />
                  </Box>
                  <Folder size={28} color="#4A5568" />
                  <Box
                    as="button"
                    onClick={() => setSelectedFolderId(folder.id)}
                    cursor="pointer"
                    p={0}
                    bg="transparent"
                    border="none"
                    textAlign="left"
                    flex="1"
                    _hover={{ textDecoration: "underline" }}
                  >
                    <VStack align="flex-start" spacing={0} w="100%">
                      <Text fontSize="sm" fontWeight="medium" textAlign="left" isTruncated w="100%">
                        {folder.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500" textAlign="left" w="100%">
                        FOLDER
                      </Text>
                    </VStack>
                  </Box>
                </HStack>
              ))}
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={6} mb={10}>
              {projectFolders.map((folder) => (
                <Box key={folder.id} display="flex" flexDirection="column" alignItems="center">
                  <Box p={4} bg="white" borderRadius="md" boxShadow="sm" _hover={{ boxShadow: "md", cursor: "pointer" }} display="flex" flexDirection="column" alignItems="center" w="100%">
                    <Box bg="gray.100" h="200px" w="100%" borderRadius="md" mb={4} display="flex" alignItems="center" justifyContent="center" padding={10}>
                      <LucideImage size={40} color="#A0AEC0" />
                    </Box>
                  </Box>
                  <HStack align="center" justify="flex-start" w="90%" mt={2} spacing={3}>
                    <Box display="flex" alignItems="center">
                      <Folder size={28} color="#4A5568" />
                    </Box>
                    <Box
                      as="button"
                      onClick={() => setSelectedFolderId(folder.id)}
                      cursor="pointer"
                      p={0}
                      bg="transparent"
                      border="none"
                      textAlign="left"
                      flex="1"
                      _hover={{ textDecoration: "underline" }}
                    >
                      <VStack align="flex-start" spacing={0} w="100%">
                        <Text fontSize="sm" fontWeight="medium" isTruncated w="100%">
                          {folder.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500" w="100%">
                          FOLDER
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </>
      )}

      {selectedFolderId && (
        <>
          <Button mb={6} onClick={() => setSelectedFolderId(null)} variant="ghost" colorScheme="blue">
            ← Back to all folders
          </Button>
          <Heading size="lg" fontWeight="semibold" mb={4}>
            Files in {projectFolders.find(f => f.id === selectedFolderId)?.name}
          </Heading>
          {visibleFiles.length === 0 ? (
            <Text color="gray.500">No files in this folder.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {visibleFiles.map((file) => (
                <HStack key={file.id} p={4} bg="white" borderRadius="md" boxShadow="sm" _hover={{ boxShadow: "md", cursor: "pointer", transform: "translateY(-2px) scale(1.03)" }} spacing={4} align="center">
                  <Box bg="gray.100" borderRadius="md" p={2} display="flex" alignItems="center" justifyContent="center">
                    <LucideImage size={32} color="#A0AEC0" />
                  </Box>
                  <File size={28} color="#4A5568" />
                  <Box
                    as="a"
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    cursor="pointer"
                    p={0}
                    bg="transparent"
                    border="none"
                    textAlign="left"
                    flex="1"
                    _hover={{ textDecoration: "underline" }}
                    download
                  >
                    <VStack align="flex-start" spacing={0} w="100%">
                      <Text fontSize="sm" fontWeight="medium" isTruncated w="100%">
                        {file.file_name.replace(/\.[^/.]+$/, "")}
                      </Text>
                      <Text fontSize="xs" color="gray.500" w="100%">
                        {file.file_name.split(".").pop().toUpperCase()}
                      </Text>
                    </VStack>
                  </Box>
                </HStack>
              ))}
            </VStack>
          )}
        </>
      )}
    </Box>
  );
};

export default Reports;
