"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  useBreakpointValue,
  Menu,
  Portal,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

const Expenses = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const isMobile = useBreakpointValue({ base: true, md: false }); 

  const menuItems = [
    { label: "Overview", value: "overview" },
    { label: "Monthly Breakdown", value: "monthly-breakdown" },
    { label: "Yearly Trends", value: "yearly-trends" },
    { label: "Custom Reports", value: "custom-reports" },
  ];

  return (
    <>
      <VStack 
        spacing={4} 
        align="stretch" 
        p={{ base: 4, md: 6 }} 
        pt={{ base: 1, md: 1 }} 
        minH="50vh"
      >
        {/* Top Section */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={6}
          direction={isMobile ? "column" : "row"}
        >
          {/* Page Title */}
          <Heading
            size="4xl"
            textAlign={isMobile ? "center" : "left"} 
            fontWeight="bold"
            fontFamily={"Playfair Display, Serif"}
          >
            Expenses Dashboard
          </Heading>

          {/* Menu Section */}
          {isMobile ? (
            
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  w="50%"
                  mt={4} 
                >
                  {activeMenu}
                  {<ChevronDown size={16} />}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {menuItems.map((item) => (
                      <Menu.Item
                        key={item.value}
                        value={item.value}
                        onClick={() => setActiveMenu(item.label)}
                      >
                        {item.label}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            // Horizontal menu for larger screens
            <Flex justifyContent="flex-end" ml={4}>
              <HStack align="center" >
                {menuItems.map((item) => (
                  <Text
                    key={item.value}
                    fontSize="sm"
                    fontWeight={activeMenu === item.label ? "bold" : "normal"}
                    color={activeMenu === item.label ? "black.500" : "gray.600"}
                    cursor="pointer"
                    px={2}
                    onClick={() => setActiveMenu(item.label)}
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    {item.label}
                  </Text>
                ))}
              </HStack>
            </Flex>
          )}
        </Flex>

        {/* Main Content Section */}
        <Flex direction={{ base: "column", md: "row" }} gap={4} alignItems="flex-start">
          {/* Main Box */}
          <Box
            flex={{ base: "none", md: "1" }} 
            w={{ base: "100%", md: "auto" }}
            p={4}
            bg="gray.100"
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h="450px"
          >
            <Text fontSize="md" color="gray.700">
              Additional information or content can go here.
            </Text>
          </Box>

          {/* Right Box (Hidden on smaller displays) */}
          {!isMobile && (
            <Box
              w="300px"
              p={5}
              bg="gray.200"
              borderRadius="md"
              boxShadow="sm"
              textAlign="center"
              h="450px" 
            >
              <Text fontSize="md" color="gray.700">
                This is the right box, visible only on larger screens.
              </Text>
            </Box>
          )}
        </Flex>

        {/* Grid Section */}
        <SimpleGrid 
          columns={{ base: 1, md: 3 }} 
          columnGap={6} 
          rowGap={6} 
          mt={8}
        >
          {/* First Box */}
          <Box
            bg="blue.100"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h={{ base: "150px", md: "400px" }} 
            w="100%"
            minWidth={{ base: "250px", md: "350px" }} 
          >
            <Text fontSize="lg" fontWeight="bold">
              Summary 1
            </Text>
            <Text fontSize="sm" color="gray.600">
              Details about summary 1.
            </Text>
          </Box>

          {/* Second Box */}
          <Box
            bg="yellow.100"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h={{ base: "150px", md: "400px" }} 
            w="100%"
            minWidth={{ base: "250px", md: "350px" }} 
          >
            <Text fontSize="lg" fontWeight="bold">
              Summary 3
            </Text>
            <Text fontSize="sm" color="gray.600">
              Details about summary 3.
            </Text>
          </Box>

          {/* Third Box */}
          <Box
            bg="red.100"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h={{ base: "150px", md: "400px" }} 
            w="100%"
            minWidth={{ base: "250px", md: "350px" }} 
          >
            <Text fontSize="lg" fontWeight="bold">
              Advertisement
            </Text>
            <Text fontSize="sm" color="gray.600">
              This space can be used for advertising or other important information.
            </Text>
          </Box>
        </SimpleGrid>

        {/* New Box after Grid */}
        <Box
          bg="green.100"
          p={6}
          borderRadius="md"
          boxShadow="sm"
          textAlign="center"
          mt={10} // Ensure even spacing with the grid above
          h="400px"
        >
          <Text fontSize="lg" fontWeight="bold">
            Additional Information
          </Text>
          <Text fontSize="sm" color="gray.600">
            This is a new box added after the grid section with some important content.
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default Expenses;