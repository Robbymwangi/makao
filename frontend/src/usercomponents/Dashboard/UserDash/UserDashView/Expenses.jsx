"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Flex,
  Card,
  ColorSwatch,
  Stat,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowUpRight, ArrowDownRight, BarChart2, LineChart, Settings, User } from "lucide-react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart as ReBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, LineChart as ReLineChart, ResponsiveContainer } from "recharts";

// Demo Data
const summaryCards = [
  {
    title: "Total Sales",
    value: "$1,200,000",
    trend: "up",
    change: "+8%",
    color: "green.500",
  },
  {
    title: "Total Revenue",
    value: "$950,000",
    trend: "down",
    change: "-3%",
    color: "red.500",
  },
  {
    title: "Profit",
    value: "$320,000",
    trend: "up",
    change: "+5%",
    color: "green.500",
  },
];

const lineChartData = [
  { month: "Jan", sales: 120, revenue: 100, profit: 40 },
  { month: "Feb", sales: 140, revenue: 110, profit: 50 },
  { month: "Mar", sales: 160, revenue: 120, profit: 60 },
  { month: "Apr", sales: 180, revenue: 130, profit: 70 },
  { month: "May", sales: 200, revenue: 150, profit: 80 },
  { month: "Jun", sales: 170, revenue: 140, profit: 65 },
];

const topCategories = [
  { name: "Residential", value: "$700,000", trend: "up", change: "+10%" },
  { name: "Commercial", value: "$300,000", trend: "down", change: "-2%" },
  { name: "Land", value: "$200,000", trend: "up", change: "+7%" },
];

const barChartData = [
  { category: "Residential", value: 700 },
  { category: "Commercial", value: 300 },
  { category: "Land", value: 200 },
  { category: "Industrial", value: 400 },
  { category: "Retail", value: 250 },
  { category: "Agricultural", value: 150 },
  { category: "Hospitality", value: 350 },
  { category: "Mixed-Use", value: 500 },
];

const miniCards = [
  {
    title: "Residential Sales",
    data: [100, 120, 130, 140, 160, 170],
    color: "blue.solid",
  },
  {
    title: "Commercial Revenue",
    data: [80, 90, 100, 110, 105, 120],
    color: "teal.solid",
  },
  {
    title: "Land Profit",
    data: [30, 40, 35, 45, 50, 55],
    color: "purple.solid",
  },
];

const Expenses = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  // Line Chart using @chakra-ui/charts
  const lineChart = useChart({
    data: lineChartData,
    series: [
      { name: "sales", color: "blue.solid", label: "Sales" },
      { name: "revenue", color: "green.solid", label: "Revenue" },
      { name: "profit", color: "purple.solid", label: "Profit" },
    ],
  });

  // Bar Chart using @chakra-ui/charts
  const barChart = useChart({
    data: barChartData,
    series: [{ name: "value", color: "blue.solid" }],
  });

  return (
    <VStack spacing={10} align="stretch" p={{ base: 4, md: 8 }}  minH="100vh">
      {/* Page Title */}
      <Heading size="2xl" mb={6} color="gray.700" textAlign="left" fontWeight={"bold"}>
        Expenses Dashboard
      </Heading>

      {/* Top Cards Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
        {summaryCards.map((card, idx) => (
          <Box
            key={idx}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text fontSize="md" color="gray.500" mb={1}>
                {card.title}
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {card.value}
              </Text>
              <HStack mt={2}>
                <Badge colorScheme={card.trend === "up" ? "green" : "red"}>
                  {card.change}
                </Badge>
                {card.trend === "up" ? (
                  <ArrowUpRight color="green" />
                ) : (
                  <ArrowDownRight color="red" />
                )}
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* Main Section: Line Chart + Top Categories */}
      <Flex direction={{ base: "column", lg: "row" }} gap={12} mt={8}>
        {/* Line Chart */}
        <Box flex="2" bg="white" borderRadius="lg" boxShadow="md" p={8}>
          <Heading size="md" mb={6}>
            Sales, Revenue & Profit Trends
          </Heading>
          <Chart.Root maxH="16rem" chart={lineChart}>
            <ReLineChart data={lineChart.data}>
              <CartesianGrid stroke={lineChart.color("border")} vertical={false} />
              <XAxis
                axisLine={false}
                dataKey={lineChart.key("month")}
                tickFormatter={(value) => value}
                stroke={lineChart.color("border")}
              />
              <YAxis axisLine={false} tickLine={false} />
              {lineChart.series.map((item) => (
                <Line
                  key={item.name}
                  isAnimationActive={false}
                  dataKey={lineChart.key(item.name)}
                  stroke={lineChart.color(item.color)}
                  strokeWidth={2}
                  dot={false}
                  name={item.label}
                />
              ))}
              <Tooltip />
            </ReLineChart>
          </Chart.Root>
        </Box>
        {/* Top Categories */}
        <VStack flex="1" spacing={6} align="stretch" mt={{ base: 8, lg: 0 }}>
          <Heading size="md" mb={4}>
            Top-Selling Categories
          </Heading>
          {topCategories.map((cat, idx) => (
            <Box
              key={idx}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              p={6}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Text fontWeight="bold">{cat.name}</Text>
                <Text color="gray.500">{cat.value}</Text>
              </Box>
              <HStack>
                <Badge colorScheme={cat.trend === "up" ? "green" : "red"}>
                  {cat.change}
                </Badge>
                {cat.trend === "up" ? (
                  <ArrowUpRight color="green" />
                ) : (
                  <ArrowDownRight color="red" />
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      </Flex>

      {/* Bar Chart Section */}
      <Box bg="white" borderRadius="lg" boxShadow="md" p={8} mt={12}>
        <Heading size="md" mb={6}>
          Category Comparison
        </Heading>
        <Chart.Root maxH="16rem" chart={barChart}>
          <ReBarChart data={barChart.data}>
            <CartesianGrid stroke={barChart.color("border.muted")} vertical={false} />
            <XAxis axisLine={false} tickLine={false} dataKey={barChart.key("category")} />
            <YAxis axisLine={false} tickLine={false} />
            {barChart.series.map((item) => (
              <Bar
                key={item.name}
                isAnimationActive={false}
                dataKey={barChart.key(item.name)}
                fill={barChart.color(item.color)}
              />
            ))}
            <Tooltip />
          </ReBarChart>
        </Chart.Root>
      </Box>

      {/* Mini Cards with Mini Line Charts */}
      <Heading size="md" mt={12} mb={6}>
        Detailed Breakdown
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {miniCards.map((mini, idx) => {
          const miniChart = useChart({
            data: mini.data.map((v, i) => ({ x: i + 1, y: v })),
            series: [{ name: "y", color: mini.color }],
          });
          return (
            <Box
              key={idx}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              p={6}
              cursor="pointer"
              onClick={() => setExpandedCard(idx === expandedCard ? null : idx)}
              transition="box-shadow 0.2s"
              _hover={{ boxShadow: "xl" }}
            >
              <Text fontWeight="bold" mb={4}>
                {mini.title}
              </Text>
              <Chart.Root maxH="5rem" chart={miniChart}>
                <ReLineChart data={miniChart.data}>
                  <Line
                    type="monotone"
                    dataKey={miniChart.key("y")}
                    stroke={miniChart.color(mini.color)}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip />
                </ReLineChart>
              </Chart.Root>
              {expandedCard === idx && (
                <Box mt={4}>
                  <Text fontSize="sm" color="gray.600">
                    More detailed analysis for {mini.title}...
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

export default Expenses;