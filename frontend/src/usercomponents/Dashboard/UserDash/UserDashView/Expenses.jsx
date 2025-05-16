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
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

const Expenses = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const isMobile = useBreakpointValue({ base: true, md: false }); // Determine if the screen is small

  const menuItems = [
    { label: "Overview", value: "overview" },
    { label: "Monthly Breakdown", value: "monthly-breakdown" },
    { label: "Yearly Trends", value: "yearly-trends" },
    { label: "Custom Reports", value: "custom-reports" },
  ];

  return (
    <>
      <VStack spacing={4} align="stretch" p={{ base: 4, md: 6 }} minH="50vh">
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
            color="gray.700"
            textAlign={isMobile ? "center" : "left"} 
            fontWeight="bold"
            fontFamily={"Playfair Display, Serif"}
          >
            Expenses Dashboard
          </Heading>

          {/* Menu Section */}
          {isMobile ? (
            // Dropdown for smaller screens
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  w="50%"
                  mt={4} // Add margin-top for spacing on smaller screens
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
            flex="1"
            p={4}
            bg="gray.100"
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h="400px"
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
              h="400px" // Set a fixed height for the right box
            >
              <Text fontSize="md" color="gray.700">
                This is the right box, visible only on larger screens.
              </Text>
            </Box>
          )}
        </Flex>

        {/* Grid Section */}
        <Grid
          templateRows="repeat(2, 1fr)" // Two rows
          templateColumns="repeat(4, 1fr)" // Four columns
          gap={6} // Spacing between grid items
          mt={8}
        >
          {/* First Box */}
          <GridItem colSpan={1}>
            <Box
              bg="blue.100"
              p={6}
              borderRadius="md"
              boxShadow="sm"
              textAlign="center"
              h="210px"
              w="100%" // Ensure it spans the grid column width
            >
              <Text fontSize="lg" fontWeight="bold">
                Summary 1
              </Text>
              <Text fontSize="sm" color="gray.600">
                Details about summary 1.
              </Text>
            </Box>
          </GridItem>

          {/* Second Box */}
          <GridItem colSpan={1}>
            <Box
              bg="yellow.100"
              p={6}
              borderRadius="md"
              boxShadow="sm"
              textAlign="center"
              h="210px"
              w="100%"
            >
              <Text fontSize="lg" fontWeight="bold">
                Summary 3
              </Text>
              <Text fontSize="sm" color="gray.600">
                Details about summary 3.
              </Text>
            </Box>
          </GridItem>

          {/* Third Box */}
          <GridItem colSpan={2}>
            <Box
              bg="red.100"
              p={6}
              borderRadius="md"
              boxShadow="sm"
              textAlign="center"
              h="210px"
              w="100%"
            >
              <Text fontSize="lg" fontWeight="bold">
                Advertisement
              </Text>
              <Text fontSize="sm" color="gray.600">
                This space can be used for advertising or other important information.
              </Text>
            </Box>
          </GridItem>
        </Grid>

        {/* Full-Width Box */}
        <Box
          bg="green.100"
          p={8}
          borderRadius="md"
          boxShadow="sm"
          textAlign="center"
          mt={4} // Smaller margin-top to bring it closer to the grid
          w="100%" // Occupy the entire width
        >
          <Text fontSize="lg" fontWeight="bold">
            Full-Width Section
          </Text>
          <Text fontSize="sm" color="gray.600">
            This is a full-width box added below the grid.
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default Expenses;