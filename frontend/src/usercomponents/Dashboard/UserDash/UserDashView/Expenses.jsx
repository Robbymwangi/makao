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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
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
  BarChart,
  Bar,
} from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";
import { ChevronDown, Download, Filter } from "lucide-react";

const Expenses = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const menuItems = [
    { label: "Overview", value: "overview" },
    { label: "Budget Analysis", value: "budget" },
    { label: "Cost Breakdown", value: "costs" },
    { label: "Forecasting", value: "forecast" },
  ];

  // Sample data for charts
  const monthlyData = [
    { month: "Jan", actual: 50000, planned: 45000 },
    { month: "Feb", actual: 48000, planned: 45000 },
    { month: "Mar", actual: 52000, planned: 45000 },
    { month: "Apr", actual: 47000, planned: 45000 },
    { month: "May", actual: 53000, planned: 45000 },
    { month: "Jun", actual: 49000, planned: 45000 },
  ];

  const expenseCategories = [
    { name: "Materials", value: 35000, color: "#319795" },
    { name: "Labor", value: 25000, color: "#805AD5" },
    { name: "Equipment", value: 15000, color: "#3182CE" },
    { name: "Permits", value: 8000, color: "#DD6B20" },
    { name: "Other", value: 5000, color: "#38A169" },
  ];

  const recentTransactions = [
    { date: "2024-03-15", description: "Construction Materials", amount: 12500, status: "completed" },
    { date: "2024-03-14", description: "Labor Costs", amount: 8000, status: "pending" },
    { date: "2024-03-13", description: "Equipment Rental", amount: 5000, status: "completed" },
    { date: "2024-03-12", description: "Permits", amount: 2000, status: "completed" },
  ];

  const budgetProgress = {
    total: 150000,
    spent: 88000,
    remaining: 62000,
    percentageUsed: (88000 / 150000) * 100,
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Section */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <Heading size="lg" fontFamily="Playfair Display">Financial Dashboard</Heading>
        <HStack spacing={4}>
          <Button leftIcon={<Filter size={20} />} variant="outline">
            Filter
          </Button>
          <Button leftIcon={<Download size={20} />} variant="outline">
            Export
          </Button>
        </HStack>
      </Flex>

      {/* Budget Overview Cards */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <Stat.Root p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Total Budget</Stat.Label>
          <Stat.ValueText fontSize="2xl">${budgetProgress.total.toLocaleString()}</Stat.ValueText>
        </Stat.Root>
        <Stat.Root p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Spent</Stat.Label>
          <Stat.ValueText fontSize="2xl" color="red.500">
            ${budgetProgress.spent.toLocaleString()}
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Remaining</Stat.Label>
          <Stat.ValueText fontSize="2xl" color="green.500">
            ${budgetProgress.remaining.toLocaleString()}
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Budget Utilized</Stat.Label>
          <VStack align="stretch" spacing={2}>
            <Stat.ValueText fontSize="2xl">{budgetProgress.percentageUsed.toFixed(1)}%</Stat.ValueText>
            <Progress value={budgetProgress.percentageUsed} colorScheme="blue" borderRadius="full" />
          </VStack>
        </Stat.Root>
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Monthly Expenses Trend */}
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Heading size="sm" mb={4}>Monthly Expenses Trend</Heading>
          <AreaChart width={500} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="actual" stroke="#3182CE" fill="#3182CE" fillOpacity={0.3} />
            <Area type="monotone" dataKey="planned" stroke="#805AD5" fill="#805AD5" fillOpacity={0.3} />
          </AreaChart>
        </Box>

        {/* Expense Categories */}
        <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
          <Heading size="sm" mb={4}>Expense Categories</Heading>
          <PieChart width={500} height={300}>
            <Pie
              data={expenseCategories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {expenseCategories.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>
      </SimpleGrid>

      {/* Recent Transactions */}
      <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
        <Heading size="sm" mb={4}>Recent Transactions</Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th isNumeric>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {recentTransactions.map((transaction, index) => (
              <Tr key={index}>
                <Td>{transaction.date}</Td>
                <Td>{transaction.description}</Td>
                <Td isNumeric>${transaction.amount.toLocaleString()}</Td>
                <Td>
                  <Badge
                    colorScheme={transaction.status === "completed" ? "green" : "yellow"}
                  >
                    {transaction.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Expenses;