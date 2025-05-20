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
  SimpleGrid,
  Stat,
} from "@chakra-ui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";
import { ChevronDown } from "lucide-react";

const Expenses = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [selectedFilter, setSelectedFilter] = useState("This Month"); // Track selected filter
  const isMobile = useBreakpointValue({ base: true, md: false });

  const menuItems = [
    { label: "Overview", value: "overview" },
    { label: "Monthly Breakdown", value: "monthly-breakdown" },
    { label: "Yearly Trends", value: "yearly-trends" },
    { label: "Custom Reports", value: "custom-reports" },
  ];

  const chart = useChart({
    data: [
      { labor: 5000, materials: 8000, equipment: 3000, month: "January" },
      { labor: 4500, materials: 7500, equipment: 2800, month: "February" },
      { labor: 5200, materials: 8200, equipment: 3100, month: "March" },
      { labor: 4800, materials: 7700, equipment: 2900, month: "April" },
      { labor: 5300, materials: 8500, equipment: 3200, month: "May" },
    ],
    series: [
      { name: "labor", color: "teal.solid" },
      { name: "materials", color: "purple.solid" },
      { name: "equipment", color: "blue.solid" },
    ],
  });

  const pieChartData = [
    { name: "Labor", value: 5000 + 4500 + 5200 + 4800 + 5300, color: "#319795" },
    { name: "Materials", value: 8000 + 7500 + 8200 + 7700 + 8500, color: "#805AD5" },
    { name: "Equipment", value: 3000 + 2800 + 3100 + 2900 + 3200, color: "#3182CE" },
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
                <Button variant="outline" size="lg" w="50%" mt={4}>
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
            <Flex justifyContent="flex-end" ml={4}>
              <HStack align="center">
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
          {/* Main Box (Area Chart) */}
          <Box
            flex={{ base: "none", md: "1" }}
            w={{ base: "100%", md: "auto" }}
            p={4}
            bg="white.600"
            borderRadius="lg"
            boxShadow="sm"
            textAlign="center"
            h="450px"
            borderWidth="2px"
          >
            {/* Chart Title and Filter Button */}
            <Flex justifyContent="space-between" alignItems="center" mb={8}>
              <Text fontSize="xl" fontWeight="bold" textAlign={"left"}>
                Construction Expenses Overview
              </Text>

              {/* Filter Menu Button */}
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Flex
                    as="button"
                    align="center"
                    gap={2}
                    px={4}
                    py={2}
                    borderRadius="md"
                    _hover={{ bg: "gray.100" }}
                    boxShadow="sm"
                  >
                    <ChevronDown size={16} />
                    <Text>{selectedFilter}</Text> {/* Display selected filter */}
                  </Flex>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="200px" boxShadow="xl">
                      <Menu.Item
                        onClick={() => setSelectedFilter("This Month")} // Update filter
                        _hover={{ bg: "gray.100" }}
                      >
                        This Month
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => setSelectedFilter("Quarterly")} // Update filter
                        _hover={{ bg: "gray.100" }}
                      >
                        Quarterly
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => setSelectedFilter("Yearly")} // Update filter
                        _hover={{ bg: "gray.100" }}
                      >
                        Yearly
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Flex>

            {/* Area Chart */}
            <Chart.Root maxH="xs" chart={chart}>
              <AreaChart
                data={chart.data}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  stroke={chart.color("border")}
                  vertical={true}
                  horizontal={true}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey={chart.key("month")}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={false}
                  animationDuration={100}
                  content={<Chart.Tooltip />}
                />
                <Legend content={<Chart.Legend />} />

                {chart.series.map((item) => (
                  <defs key={item.name}>
                    <Chart.Gradient
                      id={`${item.name}-gradient`}
                      stops={[
                        { offset: "0%", color: item.color, opacity: 0.3 },
                        { offset: "100%", color: item.color, opacity: 0.05 },
                      ]}
                    />
                  </defs>
                ))}

                {chart.series.map((item) => (
                  <Area
                    key={item.name}
                    type="natural"
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                    dataKey={chart.key(item.name)}
                    fill={`url(#${item.name}-gradient)`}
                    stroke={chart.color(item.color)}
                    strokeWidth={2}
                    stackId="a"
                  />
                ))}
              </AreaChart>
            </Chart.Root>
          </Box>

          {/* Right Box (Hidden on smaller displays) */}
          {!isMobile && (
            <Box
              w="300px"
              p={5}
              bg="white.600"
              textAlign="center"
              h="auto"
              position="relative"
              borderWidth="2px"
              borderRadius="md"
            >
              {/* Pie Chart Heading */}
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                Expense Distribution
              </Text>

              {/* Pie Chart */}
              <Chart.Root
                boxSize="200px"
                position="relative"
                mx="auto"
                chart={chart}
              >
                <PieChart>
                  <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip hideLabel />}
                  />
                  <Pie
                    isAnimationActive={false}
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    labelLine={{ stroke: chart.color("border.emphasized") }}
                    label={{
                      fill: chart.color("fg.muted"),
                      style: { fontWeight: "600" },
                    }}
                  >
                    {pieChartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{
                      fontSize: "12px",
                      marginTop: "10px",
                    }}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontWeight: "bold" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </Chart.Root>

              {/* Stat Elements Below the Chart */}
              <Box mt={6}>
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={4}
                  textAlign="center"
                >
                  <Stat.Root
                    p={2}
                    bg="transparent"
                    _dark={{ bg: "transparent" }}
                  >
                    <Stat.Label fontSize="xs" color="gray.600">
                      Total Labor Cost
                    </Stat.Label>
                    <Stat.ValueText fontSize="sm">$25,000</Stat.ValueText>
                  </Stat.Root>

                  <Stat.Root
                    p={2}
                    bg="transparent"
                    _dark={{ bg: "transparent" }}
                  >
                    <Stat.Label fontSize="xs" color="gray.600">
                      Total Material Cost
                    </Stat.Label>
                    <Stat.ValueText fontSize="sm">$39,000</Stat.ValueText>
                  </Stat.Root>

                  <Stat.Root
                    p={1}
                    bg="transparent"
                    _dark={{ bg: "transparent" }}
                  >
                    <Stat.Label fontSize="xs" color="gray.600">
                      Total Equipment Cost
                    </Stat.Label>
                    <Stat.ValueText fontSize="sm">$15,000</Stat.ValueText>
                  </Stat.Root>

                  <Stat.Root
                    p={2}
                    bg="transparent"
                    _dark={{ bg: "transparent" }}
                  >
                    <Stat.Label fontSize="xs" color="gray.600">
                      Total Expenses
                    </Stat.Label>
                    <Stat.ValueText fontSize="sm">$79,000</Stat.ValueText>
                  </Stat.Root>
                </SimpleGrid>
              </Box>
            </Box>
          )}
        </Flex>

        {/* Grid Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} columnGap={6} rowGap={6} mt={8}>
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

          {/* Third Box */}
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

          {/* Fourth Box */}
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
          mt={10}
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