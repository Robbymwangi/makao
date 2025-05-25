"use client";
import React, { useState, memo } from "react";
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
  Bar,
  BarChart,
} from "recharts";
import { Chart, useChart, BarSegment } from "@chakra-ui/charts";
import { ChevronDown, Expand } from "lucide-react";

// ExpensesList component for Team Expenses (color bullets)
const ExpensesList = memo(({ data }) => {
  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <VStack mt={6} align="start" w="100%">
      {data.map((item) => {
        const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
        return (
          <HStack
            key={item.name}
            spacing={4}
            align="center"
            w="100%"
            px={2}
            py={1}
          >
            <Box
              w="12px"
              h="12px"
              borderRadius="full"
              bg={item.color}
            />
            <Text fontSize="sm" fontWeight="normal" color="gray.700">
              {item.name}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="gray.700"
              ml="auto"
              px={2}
              py={1}
            >
              ${item.value.toLocaleString()}{" "}
              <Text as="span" fontWeight="normal" color="gray.500" fontSize="xs">
                ({percent}%)
              </Text>
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
});

// ReceiptsList component for Receipts (with additional columns)
const ReceiptsList = memo(({ data }) => {
  const isMobile = useBreakpointValue({ base: true, md: false }); // Check screen size

  return (
    <VStack mt={6} align="start" w="100%">
      {/* Table Header */}
      {isMobile ? (
        // Mobile View: Only show Invoice ID and Cost headings
        <HStack
          spacing={4}
          align="center"
          w="100%"
          px={2}
          py={1}
          borderBottom="1px solid black" 
        >
          <Text fontSize="sm" fontWeight="bold" color="gray.600" flex="1">
            Invoice ID
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" flex="1" textAlign="right">
            Cost
          </Text>
        </HStack>
      ) : (
        // Desktop View: Show all headings
        <HStack
          spacing={4}
          align="center"
          w="100%"
          px={2}
          py={1}
          borderBottom="1px solid black" 
        >
          <Text fontSize="sm" fontWeight="bold" color="gray.600" flex="1">
            Invoice ID
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" flex="2">
            Company
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" flex="2">
            Date
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" flex="1" textAlign="right">
            Cost
          </Text>
        </HStack>
      )}

      {/* Table Rows */}
      {data.map((item) => (
        <HStack
          key={item.invoiceId}
          spacing={4}
          align="center"
          w="100%"
          px={2}
          py={1}
          borderBottom="1px solid black" 
        >
          {/* Invoice ID */}
          <Text fontSize="sm" fontWeight="normal" color="gray.700" flex="1">
            {item.invoiceId}
          </Text>

          {/* Company and Date (hidden on mobile) */}
          {!isMobile && (
            <>
              <Text fontSize="sm" fontWeight="normal" color="gray.700" flex="2">
                {item.company}
              </Text>
              <Text fontSize="sm" fontWeight="normal" color="gray.700" flex="2">
                {item.date}
              </Text>
            </>
          )}

          {/* Cost */}
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.700"
            flex="1"
            textAlign="right"
          >
            ${item.cost.toLocaleString()}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
});

// Add this above the Expenses component or in a suitable place in the file
const estimatedActualChart = (selectedFilter) => {
  // Example data for estimated vs actual expenses per month
  const data = [
    { month: "Jan", estimated: 12000, actual: 11000 },
    { month: "Feb", estimated: 15000, actual: 14000 },
    { month: "Mar", estimated: 17000, actual: 17500 },
    { month: "Apr", estimated: 16000, actual: 15500 },
    { month: "May", estimated: 18000, actual: 18500 },
  ];

  const chart = useChart({
    data,
    series: [
      { name: "estimated", color: "blue.solid" },
      { name: "actual", color: "green.solid" },
    ],
  });

  return (
    <Chart.Root maxH="md" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          tickLine={false}
          dataKey={chart.key("month")}
          stroke={chart.color("border")}
        />
        <YAxis tickLine={false} stroke={chart.color("border")} />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        {/* Move Legend to the bottom and make it horizontal */}
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: 16 }}
          content={<Chart.Legend orientation="horizontal" />}
        />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            barSize={58} // Decrease the width of the bars only
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </Chart.Root>
  );
};

// Main Expenses component
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

  const barChartData = useChart({
    sort: { by: "value", direction: "desc" },
    data: [
      { name: "Construction", value: 45000, color: "teal.solid" },
      { name: "Landscaping", value: 30000, color: "green.solid" },
      { name: "Electrical", value: 20000, color: "yellow.solid" },
      { name: "Plumbing", value: 15000, color: "blue.solid" },
      { name: "Other", value: 10000, color: "purple.solid" },
    ],
  });

  const receiptsData = [
    {
      invoiceId: "#001",
      company: "ABC Manufacturing",
      date: "2025-05-01",
      cost: 1200,
    },
    {
      invoiceId: "#002",
      company: "XYZ Supplies",
      date: "2025-05-10",
      cost: 950,
    },
    {
      invoiceId: "#003",
      company: "Global Tech",
      date: "2025-05-15",
      cost: 2100,
    },
    {
      invoiceId: "#004",
      company: "Home Builders Inc.",
      date: "2025-05-20",
      cost: 1800,
    },
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
                    isAnimationActive={true} 
                    animationDuration={800} 
                    animationEasing="ease-in-out" 
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
          {/* Team Expenses */}
          <Box
            bg="white.600"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            textAlign="left"
            h="auto"
            minH="150px"
            w="100%"
            minWidth={{ base: "250px", md: "350px" }}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Heading size="lg" fontWeight="bold">
                Team Expenses
              </Heading>
              <Button
                variant="ghost"
                size="sm"
                px={2}
                py={1}
                fontWeight="normal"
                color="black.700"
                _hover={{ textDecoration: "underline", bg: "transparent" }}
                _active={{ bg: "transparent" }}
                boxShadow="none"
                bg="transparent"
              >
                <Expand size={20} />
              </Button>
            </Flex>
            {/* BarSegment Chart */}
            <BarSegment.Root chart={barChartData} barSize="3">
              <BarSegment.Content>
                <BarSegment.Bar gap="0.5" />
              </BarSegment.Content>
            </BarSegment.Root>
            {/* Expenses List */}
            <ExpensesList data={barChartData.data} />
          </Box>

          {/* Receipts */}
          <Box
            bg="white.600"
            p={6}
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h={{ base: "150px", md: "400px" }}
            minH="300px"
            w="100%"
            minWidth={{ base: "250px", md: "350px" }}
          >

            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Heading size="lg" fontWeight="bold">
                Receipts
              </Heading>
              <Button
                variant="ghost"
                size="sm"
                px={2}
                py={1}
                fontWeight="normal"
                color="black.700"
                _hover={{ textDecoration: "underline", bg: "transparent" }}
                _active={{ bg: "transparent" }}
                boxShadow="none"
                bg="transparent"
              >
                <Expand size={20} />
              </Button>
            </Flex>
            {/* Receipts List */}
            <ReceiptsList data={receiptsData} />
          </Box>

          {/* Advertisements */}
          <Box
            p={0}
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
            h={{ base: "200px", md: "400px" }}
            w="100%"
            minWidth={{ base: "250px", md: "350px" }}
            position="relative"
            overflow="hidden"
          >
            {/* Gradient background with waves */}
            <Box
              position="absolute"
              inset={0}
              zIndex={0}
              as="span"
              display="block"
              w="100%"
              h="100%"
              sx={{
                // Stronger, more saturated gradient colors
                background: "linear-gradient(135deg,rgb(255, 153, 0) 0%,rgb(255, 233, 125) 100%)",
              }}
            />
            {/* SVG Waves */}
            <Box
              as="span"
              position="absolute"
              left={0}
              bottom={0}
              w="100%"
              zIndex={1}
              pointerEvents="none"
            >
              <svg viewBox="0 0 400 80" width="100%" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#fffbe6" fillOpacity="0.7" d="M0 40 Q100 80 200 40 T400 40 V80 H0Z"/>
                <path fill="#fffbe6" fillOpacity="0.5" d="M0 60 Q100 100 200 60 T400 60 V80 H0Z"/>
              </svg>
            </Box>
            {/* Ripple effect */}
            <Box
              as="span"
              position="absolute"
              top="60%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={2}
              pointerEvents="none"
            >
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="30" fill="#fffbe6" fillOpacity="0.3">
                  <animate attributeName="r" from="30" to="55" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="60" r="15" fill="#fffbe6" fillOpacity="0.5">
                  <animate attributeName="r" from="15" to="35" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </Box>
            {/* Card Content */}
            <Box
              position="relative"
              zIndex={3}
              p={8}
              color="gray.800"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              h="100%"
            >
              <Text fontSize="2xl" fontWeight="bold" mb={2} color="gray.900" letterSpacing="wide">
                Makao Bank Mortgage
              </Text>
              <Text fontSize="md" mb={4} color="gray.700">
                Unlock your dream home with <b>Makao Bank</b>! Enjoy flexible mortgage financing, low rates, and fast approval.
              </Text>
              <Button
                bgGradient="linear(to-r, #ff9800, #ffd600)"
                color="white"
                fontWeight="bold"
                px={8}
                py={2}
                borderRadius="full"
                boxShadow="md"
                _hover={{
                  bgGradient: "linear(to-r, #ffd600, #ff9800)",
                  transform: "scale(1.05)",
                }}
                zIndex={4}
              >
                Apply Now
              </Button>
            </Box>
          </Box>
        </SimpleGrid>

        {/* New Box after Grid */}
        <Box
          bg="white"
          p={10}
          borderRadius="md"
          boxShadow="sm"
          textAlign="center"
          mt={10}
          h="auto"
          minH="400px"
        >
          <Flex justifyContent="space-between" alignItems="center" mb={10}>
            <Text fontSize="lg" fontWeight="bold">
              Estimated vs Actual Expenses
            </Text>
            {/* Timeframe Filter Button */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  px={4}
                  py={2}
                  borderRadius="md"
                  fontWeight="normal"
                  color="black.700"
                  _hover={{ textDecoration: "underline", bg: "gray.100" }}
                  _active={{ bg: "gray.100" }}
                  boxShadow="none"
                  bg="transparent"
                >
                  {selectedFilter}
                  <ChevronDown size={16} style={{ marginLeft: 8 }} />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="200px" boxShadow="xl">
                    <Menu.Item
                      onClick={() => setSelectedFilter("This Month")}
                      _hover={{ bg: "gray.100" }}
                    >
                      This Month
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => setSelectedFilter("Quarterly")}
                      _hover={{ bg: "gray.100" }}
                    >
                      Quarterly
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => setSelectedFilter("Yearly")}
                      _hover={{ bg: "gray.100" }}
                    >
                      Yearly
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
          {/* Bar Chart */}
          {estimatedActualChart(selectedFilter)}
          <Text fontSize="sm" color="gray.600" mt={6}>
            This chart shows the estimated versus actual expenses per month for your project.
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default Expenses;