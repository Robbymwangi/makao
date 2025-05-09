"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  useDisclosure,
  useBreakpointValue,
  Drawer,
} from "@chakra-ui/react";
import { useNavigate, Outlet, useLocation } from "react-router";
import { LogOut, X, Home, ClipboardList, Building, MessageCircle, Settings } from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";

const menuItems = [
  { label: "Home", icon: Home, route: "/dashboard" },
  { label: "My Projects", icon: Building, route: "/dashboard/myprojects" },
  { label: "Reports", icon: ClipboardList, route: "/dashboard/reports" },
  { label: "Expenses", icon: Building, route: "/dashboard/expenses" },
  { label: "Messages", icon: MessageCircle, route: "/dashboard/messages" },
  { label: "Support", icon: Settings, route: "/dashboard/support" },
];

const DashLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Determine selected menu based on current route
  const selectedMenu =
    menuItems.find((item) =>
      location.pathname === "/dashboard"
        ? item.route === "/dashboard"
        : location.pathname.startsWith(item.route)
    )?.label || "";

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    navigate("/login");
  };

  const SidebarContent = ({ onClose, isMobile = false }) => (
    <Flex
      direction="column"
      h="100%"
      justify="space-between"
      py={4}
      px={isMobile ? 4 : collapsed ? 2 : 4}
    >
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
            <Icon size={20} />
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

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
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
          <SidebarContent onClose={toggleSidebar} />
        </Box>
      )}
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <SidebarContent isMobile onClose={onClose} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box flex="1" overflow="auto" p={6}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} minH="100%">
          <Flex justify="space-between" align="center" mb={6} gap={4} wrap="wrap" />
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashLayout;