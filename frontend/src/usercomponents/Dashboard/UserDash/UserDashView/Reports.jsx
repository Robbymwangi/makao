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
  Menu,
  Portal,
} from "@chakra-ui/react";
import {
  Plus,
  UploadCloud,
  Folder,
  File,
  Edit2,
  FileSignature,
  User,
  Image as LucideImage,
  EllipsisVertical,
  LayoutGrid,
  List,
  ChevronDown,
  MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { LuChevronRight } from "react-icons/lu";
import { useAuthStore } from "@/store/useAuthStore";
import ProjectApprovalForm from "@/usercomponents/Dashboard/UserDash/UserDashComponents/ProjectsComponents/ProjectApprovalForm";

function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms)),
  ]);
}

// Same edge function URL pattern as UserDashboard
const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/check-user-projects";

const initialFolders = [
  { id: 1, name: "Tech Innovations" },
  { id: 2, name: "Digital Masterpieces" },
  { id: 3, name: "Software Solutions" },
  { id: 4, name: "Code Inspirations" },
];

const initialFiles = [
  { id: 1, name: "2023 Innovations Report.pdf" },
  { id: 2, name: "Annual Review.pdf" },
  { id: 3, name: "Trends Development.pdf" },
  { id: 4, name: "Performance Analysis.pdf" },
];

const menuItems = [
  {
    label: "Create",
    icon: <Plus size={28} />,
    colorScheme: "blue",
    variant: "solid",
    onClick: () => toaster.create({ description: "Create clicked", type: "info" }),
  },
  {
    label: "Upload or Drop",
    icon: <UploadCloud size={28} />,
    variant: "ghost",
    onClick: () => toaster.create({ description: "Upload clicked", type: "info" }),
  },
  {
    label: "Create Folder",
    icon: <Folder size={28} />,
    variant: "ghost",
    onClick: () => toaster.create({ description: "Create Folder clicked", type: "info" }),
  },
  {
    label: "Edit PDF",
    icon: <Edit2 size={28} />,
    variant: "ghost",
    onClick: () => toaster.create({ description: "Edit PDF clicked", type: "info" }),
  },
  {
    label: "Get Signatures",
    icon: <FileSignature size={28} />,
    variant: "ghost",
    onClick: () => toaster.create({ description: "Get Signatures clicked", type: "info" }),
  },
  {
    label: "Sign Yourself",
    icon: <User size={28} />,
    variant: "ghost",
    onClick: () => toaster.create({ description: "Sign Yourself clicked", type: "info" }),
  },
];

const Reports = () => {
  const [fileView, setFileView] = useState("grid");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [folderMenuOpenId, setFolderMenuOpenId] = useState(null);
  const [fileMenuOpenId, setFileMenuOpenId] = useState(null);

  // Same auth store pattern as UserDashboard
  const user = useAuthStore((state) => state.user);
  const jwt = useAuthStore((state) => state.token);
  
  // Same state variables as UserDashboard
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [userRole, setUserRole] = useState('user');

  // Same useEffect logic as UserDashboard
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
        setUserRole(data.userRole || 'user');
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

  // Same form submission handler as UserDashboard
  const handleFormSubmit = async (formData) => {
    try {
      if (!jwt) return;
      // Submit the project approval (replace with your actual API call)
      await submitProjectApproval(jwt, formData);
      setIsFormOpen(false);
      setLoading(true);
      // Refresh the project status
      const res = await fetch(EDGE_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
      setUserProjects(data.existingProjects || []);
      setUserRole(data.userRole || 'user');
    } catch (error) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    toaster.create({ description: `Clicked: ${item.name}`, type: "info" });
  };

  // For folders: always list view on mobile, grid otherwise
  const foldersListView = isMobile;

  // For files: allow toggling, but force list view on mobile unless toggled
  const filesListView = isMobile ? fileView === "list" || true : fileView === "list";

  // Menu for folders and files
  const renderEllipsisMenu = (type, id) => (
    <Menu.Root
      open={type === "folder" ? folderMenuOpenId === id : fileMenuOpenId === id}
      onOpenChange={(open) => {
        if (type === "folder") setFolderMenuOpenId(open ? id : null);
        else setFileMenuOpenId(open ? id : null);
      }}
    >
      <Menu.Trigger asChild>
        <Box
          as="button"
          aria-label="More options"
          bg="transparent"
          border="none"
          p={1}
          onClick={e => {
            e.stopPropagation();
            if (type === "folder") setFolderMenuOpenId(id);
            else setFileMenuOpenId(id);
          }}
          _hover={{ cursor: "pointer", bg: "gray.100" }}
        >
          <EllipsisVertical size={20} color="#A0AEC0" />
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="180px" position="relative">
            <Box
              position="absolute"
              top="3"
              right="2"
              aria-label="Close menu"
              bg="transparent"
              zIndex={2}
              onClick={() => {
                if (type === "folder") setFolderMenuOpenId(null);
                else setFileMenuOpenId(null);
              }}
              _hover={{ cursor: "pointer", bg: "red.200" }}
            >
              <CloseIcon size={18} />
            </Box>
            <Box h="25px" />
            <Menu.Item
              onClick={() => toaster.create({ description: "Open clicked", type: "info" })}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
            >
              Open
            </Menu.Item>
            <Menu.Item
              onClick={() => toaster.create({ description: "Rename clicked", type: "info" })}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
            >
              Rename
            </Menu.Item>
            <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
              <Menu.TriggerItem
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
              >
                More Actions <LuChevronRight />
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      onClick={() => toaster.create({ description: "Share clicked", type: "info" })}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                    >
                      Share
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => toaster.create({ description: "Move clicked", type: "info" })}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                    >
                      Move
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Menu.Item
              onClick={() => toaster.create({ description: "Export clicked", type: "info" })}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
            >
              Export
            </Menu.Item>
            <Menu.Item
              value="delete"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              cursor="pointer"
              onClick={() => toaster.create({ description: "Delete clicked", type: "error" })}
            >
              Delete...
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );

  // Same loading screen as UserDashboard
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        textAlign="center"
        p={8}
      >
        <Spinner size="xl" color="black" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }

  // Same submission overlay screen as UserDashboard
  if (showSubmissionOverlay) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        textAlign="center"
        p={8}
      >
        <Box maxW="lg" width="100%">
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            mb={2}
            color="gray.800"
          >
            Project Approval
          </Text>
          <Text
            fontSize="lg"
            color="gray.700"
            mb={4}
          >
            Please fill in your project details below to request approval and gain
            full access to the platform. All information will be reviewed by our
            team.
          </Text>
        </Box>
        <Button colorScheme="blue" mt={4} onClick={() => setIsFormOpen(true)}>
          Submit Project Details
        </Button>
        <Dialog.Root
          open={isFormOpen}
          onOpenChange={(details) => setIsFormOpen(details.open)}
        >
          <Portal>
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
                  <ProjectApprovalForm
                    loading={loading}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Box>
    );
  }

  // Main Reports content - only shown if user has approved project
  return (
    <Box p={2}>
      {/* Page Title */}
      <Heading
        size="4xl"
        fontWeight="bold"
        mb={8}
        fontFamily="'Playfair Display', serif"
        letterSpacing="tight"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }}
      >
        Reports
      </Heading>
      
      {/* Responsive Action Menu */}
      {isMobile ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              w="60%"
              size="lg"
              variant="outline"
              mb={8}
              fontWeight="bold"
              fontSize="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              gap={2}
            >
              Menu
              <MenuIcon size={20} style={{ marginLeft: 8, flexShrink: 0 }} />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="220px" boxShadow="xl">
                {menuItems.map((item) => (
                  <Menu.Item
                    key={item.label}
                    onClick={item.onClick}
                    icon={item.icon}
                    py={4}
                    fontSize="sm"
                  >
                    <HStack spacing={3}>
                      {item.icon}
                      <Text fontWeight="medium">{item.label}</Text>
                    </HStack>
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <HStack spacing={6} mb={10} w="100%">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              colorScheme={item.colorScheme}
              variant={item.variant}
              onClick={item.onClick}
              fontSize="lg"
              fontWeight="semibold"
              h="80px"
              minW="170px"
              px={8}
              py={8}
              boxShadow="sm"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
              iconSpacing={4}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </HStack>
      )}

      {/* Folders Section */}
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="lg" fontWeight="semibold" mb={4}>
          Suggested Folders
        </Heading>
        <Button
          size="sm"
          variant="outline"
          colorScheme="blue"
          onClick={() => toaster.create({ description: "View all folders clicked", type: "info" })}
        >
          View All
        </Button>
      </HStack>
      
      {foldersListView ? (
        <VStack spacing={4} align="stretch" mb={10}>
          {initialFolders.map((folder) => (
            <HStack
              key={folder.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                boxShadow: "lg",
                cursor: "pointer",
                transform: "translateY(-2px) scale(1.03)",
                zIndex: 1,
              }}
              spacing={4}
              align="center"
            >
              <Box bg="gray.100" borderRadius="md" p={2} display="flex" alignItems="center" justifyContent="center">
                <LucideImage size={32} color="#A0AEC0" />
              </Box>
              <Folder size={28} color="#4A5568" />
              <Box
                as="button"
                onClick={() => handleItemClick(folder)}
                cursor="pointer"
                p={0}
                bg="transparent"
                border="none"
                textAlign="left"
                flex="1"
                _hover={{ textDecoration: "underline" }}
              >
                <VStack align="flex-start" spacing={0} w="100%">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    textAlign="left"
                    isTruncated
                    w="100%"
                  >
                    {folder.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500" textAlign="left" w="100%">
                    FOLDER &bull; Robbi Darwis
                  </Text>
                </VStack>
              </Box>
              <Box ml="auto">
                {renderEllipsisMenu("folder", folder.id)}
              </Box>
            </HStack>
          ))}
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={6} rowGap={8} mb={10}>
          {initialFolders.map((folder) => (
            <Box
              key={folder.id}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                _hover={{ boxShadow: "md", cursor: "pointer" }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                w="100%"
              >
                <Box
                  bg="gray.100"
                  h="200px"
                  w="100%"
                  borderRadius="md"
                  mb={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding={10}
                >
                  <LucideImage size={40} color="#A0AEC0" />
                </Box>
              </Box>
              <HStack
                align="center"
                justify="flex-start"
                w="90%"
                mt={2}
                spacing={3}
              >
                <Box display="flex" alignItems="center" height="100%">
                  <Folder size={28} color="#4A5568" />
                </Box>
                <Box
                  as="button"
                  onClick={() => handleItemClick(folder)}
                  cursor="pointer"
                  p={0}
                  bg="transparent"
                  border="none"
                  textAlign="left"
                  flex="1"
                  _hover={{ textDecoration: "underline" }}
                >
                  <VStack align="flex-start" spacing={0} w="100%">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      textAlign="left"
                      isTruncated
                      w="100%"
                    >
                      {folder.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="left" w="100%">
                      FOLDER &bull; Robbi Darwis
                    </Text>
                  </VStack>
                </Box>
                <Box ml="auto">
                  {renderEllipsisMenu("folder", folder.id)}
                </Box>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Files Section */}
      <HStack justify="space-between" align="center" mb={8} mt={10}>
        <Heading size="lg" fontWeight="semibold">
          Suggested Files
        </Heading>
        <HStack spacing={2}>
          <Button
            size="sm"
            variant={fileView === "grid" ? "solid" : "ghost"}
            colorScheme="blue"
            onClick={() => setFileView("grid")}
            aria-label="Grid view"
            isDisabled={isMobile}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            size="sm"
            variant={fileView === "list" ? "solid" : "ghost"}
            colorScheme="blue"
            onClick={() => setFileView("list")}
            aria-label="List view"
          >
            <List size={18} />
          </Button>
        </HStack>
      </HStack>
      
      {isMobile || fileView === "list" ? (
        <VStack spacing={4} align="stretch">
          {initialFiles.map((file) => (
            <HStack
              key={file.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ 
                boxShadow: "md", 
                cursor: "pointer", 
                transform: "translateY(-2px) scale(1.03)"
              }}
              spacing={4}
              align="center"
            >
              <Box bg="gray.100" borderRadius="md" p={2} display="flex" alignItems="center" justifyContent="center">
                <LucideImage size={32} color="#A0AEC0" />
              </Box>
              <File size={28} color="#4A5568" />
              <Box
                as="button"
                onClick={() => handleItemClick(file)}
                cursor="pointer"
                p={0}
                bg="transparent"
                border="none"
                textAlign="left"
                flex="1"
                _hover={{ textDecoration: "underline" }}
              >
                <VStack align="flex-start" spacing={0} w="100%">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    textAlign="left"
                    isTruncated
                    w="100%"
                  >
                    {file.name.replace(/\.[^/.]+$/, "")}
                  </Text>
                  <Text fontSize="xs" color="gray.500" textAlign="left" w="100%">
                    {file.name.split(".").pop().toUpperCase()} &bull; Robbi Darwis
                  </Text>
                </VStack>
              </Box>
              <Box ml="auto">
                {renderEllipsisMenu("file", file.id)}
              </Box>
            </HStack>
          ))}
        </VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} columnGap={6} rowGap={8}>
          {initialFiles.map((file) => (
            <Box key={file.id} display="flex" flexDirection="column" alignItems="center">
              <Box
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                _hover={{ boxShadow: "md", cursor: "pointer" }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={3}
                w="100%"
              >
                <Box
                  bg="gray.100"
                  h="200px"
                  w="90%"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LucideImage size={40} color="#A0AEC0" />
                </Box>
              </Box>
              <HStack
                align="center"
                justify="flex-start"
                w="90%"
                mt={2}
                spacing={3}
              >
                <Box display="flex" alignItems="center" height="100%">
                  <File size={28} color="#4A5568" />
                </Box>
                <Box
                  as="button"
                  onClick={() => handleItemClick(file)}
                  cursor="pointer"
                  p={0}
                  bg="transparent"
                  border="none"
                  textAlign="left"
                  flex="1"
                  _hover={{ textDecoration: "underline" }}
                >
                  <VStack align="flex-start" spacing={0} w="100%">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      textAlign="left"
                      isTruncated
                      w="100%"
                    >
                      {file.name.replace(/\.[^/.]+$/, "")}
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="left" w="100%">
                      {file.name.split(".").pop().toUpperCase()} &bull; Robbi Darwis
                    </Text>
                  </VStack>
                </Box>
                <Box ml="auto">
                  {renderEllipsisMenu("file", file.id)}
                </Box>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Reports;