import React, { useState, useRef } from "react";
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
  LogOut,
  X,
} from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";

const DashLayout = ({ userName, menuItems, defaultContent, renderContent }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]?.label || ""); // Default to the first menu item
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const avatarRef = useRef(null);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const SidebarContent = ({ onClose, isMobile = false }) => (
    <Flex direction="column" h="100%" justify="space-between" py={4} px={isMobile ? 4 : collapsed ? 2 : 4}>
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
          <Hamburger toggled={!collapsed} toggle={toggleSidebar} size={20} duration={0.3} easing="ease-in-out" />
        )}
      </HStack>

      {/* Menu Items */}
      <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
        {menuItems.map(({ label, icon: Icon }, idx) => (
          <HStack
            key={idx}
            as="button"
            spacing={3}
            px={isMobile ? 3 : collapsed ? 0 : 3}
            py={2}
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            justify={isMobile ? "flex-start" : collapsed ? "center" : "flex-start"}
            onClick={() => {
              setSelectedMenu(label); // Update selected menu item
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

      {/* Footer */}
      <Box mt="auto" pt={4}>
        <HStack
          as="button"
          spacing={3}
          px={isMobile ? 3 : collapsed ? 0 : 3}
          py={2}
          borderRadius="md"
          _hover={{ bg: "gray.100" }}
          justify={isMobile ? "flex-start" : collapsed ? "center" : "flex-start"}
          onClick={isMobile ? onClose : undefined}
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
          </Flex>

          {/* Render Content Based on Selected Menu */}
          <Stack spacing={6}>
            {renderContent ? renderContent(selectedMenu) : defaultContent}
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default DashLayout;