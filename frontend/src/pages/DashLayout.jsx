"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, VStack, HStack, useDisclosure, useBreakpointValue,
  Drawer, CloseButton, Portal, Avatar, Stack, Spinner, Button
} from "@chakra-ui/react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { LogOut, Menu } from "lucide-react";
import { Squash } from "hamburger-react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useAuthStore } from "@/store/useAuthStore";
import { getMenuByRole } from "@/utils/menuUtils";
import { toaster } from "@/components/ui/toaster";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import {
  DialogRoot, DialogHeader, DialogBody, DialogFooter,
  DialogTitle, DialogBackdrop
} from "@/components/ui/dialog";

const SidebarContent = ({ onClose, isMobile = false, collapsed, menuItems, selectedMenu, navigate, handleLogout }) => (
  <Flex direction="column" h="100%" justify="space-between" py={4} px={isMobile ? 4 : collapsed ? 2 : 4}>
    <HStack justify="space-between" mb={8}>
      {!collapsed && !isMobile && (
        <Text fontSize="xl" fontFamily="Playfair Display">Menu</Text>
      )}
      {!isMobile && (
        <Box as="button" onClick={onClose} _hover={{ bg: "gray.100" }}>
          <Squash toggled={!collapsed} size={20} duration={0.5} easing="ease-in-out" />
        </Box>
      )}
    </HStack>
    <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
      {menuItems.map(({ label, icon: Icon, route }, idx) => (
        <HStack
          key={idx}
          as="button"
          spacing={3}
          px={isMobile ? 3 : collapsed ? 0 : 3}
          py={2}
          borderRadius="md"
          _hover={{ bg: "gray.100" }}
          justify={isMobile ? "flex-start" : collapsed ? "center" : "flex-start"}
          bg={selectedMenu === label ? "gray.100" : "transparent"}
          onClick={() => {
            navigate(route);
            if (isMobile) onClose();
          }}
          transition="all 0.2s ease-in-out"
          w="full"
        >
          {Icon && <Icon size={20} />}
          {(isMobile || !collapsed) && (
            <Text transition="opacity 0.2s ease-in-out" whiteSpace="nowrap">
              {label}
            </Text>
          )}
        </HStack>
      ))}
    </VStack>
    <Box mt="auto" pt={4}>
      <HStack
        as="button"
        spacing={3}
        px={isMobile ? 3 : collapsed ? 0 : 3}
        py={2}
        borderRadius="md"
        _hover={{ bg: "gray.100" }}
        justify={isMobile ? "flex-start" : collapsed ? "center" : "flex-start"}
        onClick={handleLogout}
        transition="all 0.2s ease-in-out"
        w="full"
      >
        <LogOut size={20} />
        {(isMobile || !collapsed) && (
          <Text transition="opacity 0.2s ease-in-out">Logout</Text>
        )}
      </HStack>
    </Box>
  </Flex>
);

const DashLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, logout, isAuthenticated, user, loading } = useAuthStore();
  const [collapsed, setCollapsed] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const showDetails = useBreakpointValue({ base: false, md: true });
  const [loggingOut, setLoggingOut] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [dialogShown, setDialogShown] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mlValue = useBreakpointValue({ base: 0, md: collapsed ? "60px" : "250px" });
  const textAlignValue = useBreakpointValue({ base: "center", md: "left" });
  const positionValue = useBreakpointValue({ base: "absolute", md: "relative" });
  const leftValue = useBreakpointValue({ base: "50%", md: "auto" });
  const transformValue = useBreakpointValue({ base: "translateX(-50%)", md: "none" });

  const menuItems = role ? getMenuByRole(role) : [];
  const selectedMenu =
    menuItems.find((item) =>
      location.pathname === "/dashboard"
        ? item.route === "/dashboard"
        : location.pathname.startsWith(item.route)
    )?.label || "";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem("currentRoute");
      toaster.create({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        type: "success",
        duration: 2000,
      });
      setTimeout(() => {
        setLoggingOut(false);
        navigate("/login", { replace: true });
      }, 1800);
    } catch (error) {
      setLoggingOut(false);
      console.error("Logout error:", error);
      toaster.create({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("supabase.auth.token");
    const channel = new BroadcastChannel("makao-session");

    if (token && !dialogShown) {
      setShowSessionDialog(true);
      setDialogShown(true);
    }

    channel.onmessage = (event) => {
      if (event.data === "session-started" && !dialogShown) {
        setShowSessionDialog(true);
        setDialogShown(true);
      }
    };

    return () => {
      channel.close();
    };
  }, [dialogShown]);

  if (loggingOut || loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>{loggingOut ? "Logging out..." : "Loading..."}</Text>
        </VStack>
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return (
      <Flex direction="column" minH="100vh" bg="gray.50">
        <Box w="100%" maxW="500px" mx="auto" mt={12}>
          <AuthHeader />
          <VStack spacing={6} p={8} bg="white" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              You are not logged in
            </Text>
            <Text color="gray.600">Please log in to access your dashboard.</Text>
            <Button colorScheme="blue" size="lg" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <>
      {/* {isClient && showSessionDialog && (
        <DialogRoot open={showSessionDialog} onOpenChange={setShowSessionDialog}>
          <DialogBackdrop />
          <DialogHeader>
            <DialogTitle>Ongoing Session Detected</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text>You have an ongoing session. Please log out or continue browsing.</Text>
          </DialogBody>
          <DialogFooter>
            <Button colorScheme="blue" onClick={() => setShowSessionDialog(false)}>
              Continue Browsing
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogRoot>
      )} */}

      <Flex h="100vh" bg="gray.50">
        {!isOpen && !isMobile && (
          <Box
            as="aside"
            bg="white"
            boxShadow="md"
            w={collapsed ? "60px" : "250px"}
            transition="width 0.3s ease-in-out"
            overflow="hidden"
            zIndex="10"
          >
            <SidebarContent
              onClose={() => setCollapsed(!collapsed)}
              isMobile={false}
              collapsed={collapsed}
              menuItems={menuItems}
              selectedMenu={selectedMenu}
              navigate={navigate}
              handleLogout={handleLogout}
            />
          </Box>
        )}

        <Box
          as="header"
          bg="white"
          boxShadow="sm"
          w="100%"
          h="60px"
          position="fixed"
          top="0"
          left="0"
          zIndex="9"
        >
          <Flex align="center" justify="space-between" h="100%" px={6}>
            {isMobile && (
              <Drawer.Root open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())} placement="left" size="xs">
                <Drawer.Trigger asChild>
                  <Box as="button" p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
                    <Menu size={20} />
                  </Box>
                </Drawer.Trigger>
                <Portal>
                  <Drawer.Backdrop />
                  <Drawer.Positioner>
                    <Drawer.Content>
                      <Drawer.Header>
                        <Drawer.Title>Menu</Drawer.Title>
                        <Drawer.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                      </Drawer.Header>
                      <Drawer.Body p={0}>
                        <SidebarContent
                          isMobile={isMobile}
                          onClose={onClose}
                          collapsed={collapsed}
                          menuItems={menuItems}
                          selectedMenu={selectedMenu}
                          navigate={navigate}
                          handleLogout={handleLogout}
                        />
                      </Drawer.Body>
                    </Drawer.Content>
                  </Drawer.Positioner>
                </Portal>
              </Drawer.Root>
            )}
            <Text
              fontSize="2xl"
              ml={mlValue}
              textAlign={textAlignValue}
              position={positionValue}
              left={leftValue}
              transform={transformValue}
              transition="margin-left 0.3s ease-in-out"
              fontFamily="Playfair Display , serif"
              cursor="pointer"
              onClick={() => navigate("/dashboard")}
            >
              <Box as="span" fontWeight="bold">Makao </Box>
              <Box as="span" fontWeight="normal">Manager</Box>
            </Text>
            <HStack spacing={4}>
              <ColorModeButton />
              <Avatar.Root>
                <Avatar.Fallback name={user?.email || "User"} />
                <Avatar.Image src="https://i.pravatar.cc/300?u=iu" />
              </Avatar.Root>
              {showDetails && (
                <Stack gap={0}>
                  <Text fontSize="sm" fontWeight="bold">{user?.email?.split('@')[0]}</Text>
                  <Text fontSize="xs" color="gray.500">{user?.email}</Text>
                </Stack>
              )}
            </HStack>
          </Flex>
        </Box>

        <Box flex="1" overflow="auto" mt="60px">
          <Box bg="gray.70" boxShadow="md" borderRadius="lg" p={8} minH="calc(100vh - 60px)">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default DashLayout;
