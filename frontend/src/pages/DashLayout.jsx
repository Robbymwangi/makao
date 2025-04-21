import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Stack,
  useDisclosure,
  useBreakpointValue,
  Menu,
  Drawer,
  Portal,
} from "@chakra-ui/react";
import {
  Menu as LucideMenu,
  Home,
  ClipboardList,
  BarChart,
  Building,
  MessageCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useLocation } from "react-router";
import { Squash as Hamburger } from 'hamburger-react';

const DashLayout = ({ children, userType = "user", userName = "Makao User" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const location = useLocation();
  const avatarRef = useRef(null);

  useEffect(() => {
    if (isMobile && isOpen) onClose();
  }, [location.pathname]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = {
    user: [
      { label: "Home", icon: Home },
      { label: "Progress", icon: ClipboardList },
      { label: "Reports", icon: BarChart },
      { label: "Expenses", icon: Building },
      { label: "Messages", icon: MessageCircle },
      { label: "Support", icon: Settings },
    ],
  };

  const SidebarContent = ({ onClose, isMobile = false }) => (
    <Flex direction="column" h="100%" justify="space-between" py={4} px={isMobile ? 4 : (collapsed ? 2 : 4)}>
      <HStack justify="space-between" mb={8}>
        {!collapsed && (
          <Text fontSize="xl" fontWeight="bold" fontFamily="Playfair Display">
            Dashboard
          </Text>
        )}
        {isMobile ? (
          <Drawer.CloseTrigger asChild>
            <Box as="button" p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
              <X size={20} />
            </Box>
          </Drawer.CloseTrigger>
        ) : (
          <Hamburger 
            toggled={!collapsed} 
            toggle={toggleSidebar} 
            size={20}
            duration={0.3}
            easing="ease-in-out"
          />
        )}
      </HStack>

      <VStack align="stretch" spacing={4}>
        {menuItems[userType].map(({ label, icon: Icon }, idx) => (
          <HStack
            key={idx}
            as="button"
            spacing={3}
            px={collapsed ? 0 : 3}
            py={2}
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            justify={collapsed ? "center" : "flex-start"}
            onClick={isMobile ? onClose : undefined}
            transition="all 0.2s ease-in-out"
          >
            <Icon size={20} />
            {!collapsed && (
              <Text transition="opacity 0.2s ease-in-out">
                {label}
              </Text>
            )}
          </HStack>
        ))}
      </VStack>

      <Box mt="auto">
        <HStack
          as="button"
          spacing={3}
          px={collapsed ? 0 : 3}
          py={2}
          borderRadius="md"
          _hover={{ bg: "gray.100" }}
          justify={collapsed ? "center" : "flex-start"}
          onClick={isMobile ? onClose : undefined}
          transition="all 0.2s ease-in-out"
        >
          <LogOut size={20} />
          {!collapsed && (
            <Text transition="opacity 0.2s ease-in-out">Logout</Text>
          )}
        </HStack>
      </Box>
    </Flex>
  );

  return (
    <Flex h="100vh" bg="gray.50">
      {!isMobile && (
        <Box
          as="aside"
          bg="white"
          boxShadow="md"
          w={collapsed ? "60px" : "250px"}
          transition="width 0.3s ease-in-out"
          overflow="hidden"
          zIndex="10"
        >
          <SidebarContent onClose={toggleSidebar} />
        </Box>
      )}

      <Box flex="1" overflow="auto" p={6}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} minH="100%">
          <Flex justify="space-between" align="center" mb={6}>
            <VStack align="start" spacing={1}>
              <Text fontSize="xl" color="gray.600">
                Welcome back, {userName}!
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                Dashboard Overview
              </Text>
            </VStack>

            <HStack spacing={4}>
              {isMobile && (
                <Drawer.Root open={isOpen} onClose={onClose} placement="start">
                  <Drawer.Trigger asChild>
                    <Box as="button" p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
                      <LucideMenu size={20} />
                    </Box>
                  </Drawer.Trigger>
                  <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                      <Drawer.Content w="250px">
                        <Drawer.Body p={0}>
                          <SidebarContent onClose={onClose} isMobile />
                        </Drawer.Body>
                      </Drawer.Content>
                    </Drawer.Positioner>
                  </Portal>
                </Drawer.Root>
              )}
              
              <Menu.Root
                positioning={{ getAnchorRect: () => avatarRef.current?.getBoundingClientRect() }}
              >
                <Menu.Trigger asChild>
                  <Avatar.Root ref={avatarRef} cursor="pointer">
                    <Avatar.Fallback name={userName} />
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                  </Avatar.Root>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="160px" boxShadow="xl">
                      <Menu.Item value="profile">Profile</Menu.Item>
                      <Menu.Item value="settings">Settings</Menu.Item>
                      <Menu.Item value="logout" color="red.500" _hover={{ bg: "red.50" }}>
                        Logout
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          </Flex>

          <Stack spacing={6}>{children}</Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default DashLayout;