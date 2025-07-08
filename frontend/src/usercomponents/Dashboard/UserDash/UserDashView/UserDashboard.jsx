"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  VStack,
  HStack,
  Heading,
  useBreakpointValue,
  Box,
  Text,
  Button,
  Dialog,
  Spinner,
  Portal,
} from "@chakra-ui/react";
import { CSSTransition } from "react-transition-group";
import { useAuthStore } from "@/store/useAuthStore";
// Dashboard Components
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";
import ProjectApprovalForm from "@/usercomponents/Dashboard/UserDash/UserDashComponents/ProjectsComponents/ProjectApprovalForm";

const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/check-user-projects";

const UserDashboard = () => {
  const headingRef = useRef(null);
  const [showName, setShowName] = useState(false);
  const user = useAuthStore((state) => state.user);
  const jwt = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const headingTextAlign = useBreakpointValue({ base: "center", md: "left" });

  useEffect(() => {
    if (user) setShowName(true);
  }, [user]);

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

  const welcomeName = user?.name || "User";

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

  return (
    <>
      <style>{`
        .fade-enter {
          opacity: 0;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 1000ms ease-in;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 1500ms ease-out;
        }
      `}</style>

      <VStack spacing={6} align="stretch">
        <CSSTransition
          in={showName}
          timeout={500}
          classNames="fade"
          unmountOnExit
          nodeRef={headingRef}
        >
          <Heading
            ref={headingRef}
            fontSize="4xl"
            fontWeight="bold"
            paddingBottom="8"
            fontFamily="Playfair Display"
            textAlign={headingTextAlign}
          >
            {user ? `Welcome back, ${welcomeName}` : "Welcome to your Dashboard!"}
          </Heading>
        </CSSTransition>

        <StatsCards />
        <HStack spacing={8} align="start" mt={8}>
          <FinancialOverview />
          <ProjectTimeline />
        </HStack>
        <PhotoProgress />
        <QuickLinks />
        <AgentReport />
      </VStack>
    </>
  );
};

export default UserDashboard;