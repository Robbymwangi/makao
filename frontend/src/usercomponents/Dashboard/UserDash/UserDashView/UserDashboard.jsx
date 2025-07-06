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
import { getProjectStatus, submitProjectApproval } from "@/api/projectApproval";
// Dashboard Components
import StatsCards from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/StatsCards";
import FinancialOverview from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/FinancialOverview";
import ProjectTimeline from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/Timeline";
import PhotoProgress from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/PhotoProgress";
import QuickLinks from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/QuickLinks";
import AgentReport from "@/usercomponents/Dashboard/UserDash/UserDashComponents/HomeComponents/AgentReport";
import ProjectApprovalForm from "@/usercomponents/Dashboard/UserDash/UserDashComponents/ProjectsComponents/ProjectApprovalForm";

const UserDashboard = () => {
  const headingRef = useRef(null);
  const [showName, setShowName] = useState(false);
  const user = useAuthStore((state) => state.user);
  const jwt = useAuthStore((state) => state.token);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (user) setShowName(true);
  }, [user]);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    getProjectStatus(jwt)
      .then(setStatus)
      .finally(() => setLoading(false));
  }, [jwt]);

  const welcomeName = user?.name || "User";

  const handleFormSubmit = async (formData) => {
    await submitProjectApproval(jwt, formData);
    setIsFormOpen(false);
    setLoading(true);
    getProjectStatus(jwt)
      .then(setStatus)
      .finally(() => setLoading(false));
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

  if (!status?.has_approved_project) {
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
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
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

