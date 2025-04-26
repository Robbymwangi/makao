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
  ArrowDown,
} from "lucide-react";
import { useLocation } from "react-router";
import { Squash as Hamburger } from 'hamburger-react';

const DashLayout = ({ children, userType = "user", userName = "Makao User" }) => {
  const [collapsed, setCollapsed] = useState(true);
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
      {/* Header */}
      <HStack justify="space-between" mb={8}>
        {!collapsed && (
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" fontFamily="Playfair Display">
              Makao <span style={{ fontWeight: "normal", color: "GrayText"}}>Kurunzi</span>
            </Text>
          </VStack>
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

      {/* Menu Items */}
      <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
        {menuItems[userType].map(({ label, icon: Icon }, idx) => (
          <HStack
            key={idx}
            as="button"
            spacing={3}
            px={isMobile ? 3 : (collapsed ? 0 : 3)}
            py={2}
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            justify={isMobile ? "flex-start" : (collapsed ? "center" : "flex-start")}
            onClick={isMobile ? onClose : undefined}
            transition="all 0.2s ease-in-out"
            w="full"
          >
            <Icon size={20} />
            {(isMobile || !collapsed) && (
              <Text transition="opacity 0.2s ease-in-out" whiteSpace="nowrap">
                {label}
              </Text>
            )}
          </HStack>
        ))}
      </VStack>

      {/* Footer */}
      <Box mt="auto" pt={4}>
        <VStack align="stretch" spacing={2}>
          <HStack
            as="button"
            spacing={3}
            px={isMobile ? 3 : (collapsed ? 0 : 3)}
            py={2}
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            justify={isMobile ? "flex-start" : (collapsed ? "center" : "flex-start")}
            onClick={isMobile ? onClose : undefined}
            transition="all 0.2s ease-in-out"
            w="full"
          >
            <LogOut size={20} />
            {(isMobile || !collapsed) && (
              <Text transition="opacity 0.2s ease-in-out">Logout</Text>
            )}
          </HStack>
          {!collapsed && (
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Version 1.0
            </Text>
          )}
        </VStack>
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
          <Flex justify="space-between" align="center" mb={6} gap={4} wrap="wrap">
            {/* Left: Welcome Text */}
            <VStack align="start" spacing={1} flex="1" minW="0">
              <Text fontSize={{ base: "md", md: "xl" }} color="gray.600" isTruncated>
                Welcome back, {userName}!
              </Text>
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" isTruncated>
                Dashboard Overview
              </Text>
            </VStack>

            {/* Center: Project Selector */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <HStack
                  spacing={3}
                  px={4}
                  py={2}
                  borderRadius="full"
                  boxShadow="sm"
                  _hover={{ bg: "gray.200" }}
                  align="center"
                  justify="center"
                  cursor="pointer"
                  flexShrink={0}
                >
                  <VStack spacing={0} align="start" minW="0">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" isTruncated>
                      Selected Project
                    </Text>
                    <Text fontSize="xs" color="gray.500" isTruncated>
                      Casa Du Papel
                    </Text>
                  </VStack>
                  <Box p={1} borderRadius="full">
                    <ArrowDown size={16} />
                  </Box>
                </HStack>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="200px" boxShadow="xl">
                    <Menu.Item value="project1">Casa Du Papel</Menu.Item>
                    <Menu.Item value="project2">Project Alpha</Menu.Item>
                    <Menu.Item value="project3">Skyline Tower</Menu.Item>
                    <Menu.Item value="project4">Ocean View</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            {/* Right: Avatar and Menu Drawer */}
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
                      <Drawer.Content w="250px" maxW="100vw">
                        <Drawer.Header p={4} borderBottomWidth="1px">
                          <Text fontSize="xl" fontWeight="bold" fontFamily={"Playfair Display, Serif"} >
                            Dashboard
                          </Text>
                        </Drawer.Header>
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