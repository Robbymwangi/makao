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
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Card,
  CardBody,
  CardHeader,
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
import { Download, Filter, Menu as MenuIcon } from "lucide-react";

const Expenses = () => {
  const [selectedFilter, setSelectedFilter] = useState("This Month");

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

  const chartWidth = useBreakpointValue({ base: 300, md: 500 });
  const chartHeight = useBreakpointValue({ base: 200, md: 300 });

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Section */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <Heading size="lg" fontFamily="Playfair Display">Financial Dashboard</Heading>
        <HStack spacing={4}>
          <Menu>
            <Menu.Button as={Button} leftIcon={<Filter size={20} />} variant="outline">
              {selectedFilter}
            </Menu.Button>
            <Portal>
              <Menu.List>
                <Menu.Item onClick={() => setSelectedFilter("This Month")}>This Month</Menu.Item>
                <Menu.Item onClick={() => setSelectedFilter("Last 3 Months")}>Last 3 Months</Menu.Item>
                <Menu.Item onClick={() => setSelectedFilter("Last 6 Months")}>Last 6 Months</Menu.Item>
                <Menu.Item onClick={() => setSelectedFilter("This Year")}>This Year</Menu.Item>
              </Menu.List>
            </Portal>
          </Menu>
          <Button leftIcon={<Download size={20} />} variant="outline">
            Export
          </Button>
        </HStack>
      </Flex>

      {/* Budget Overview Cards */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <Stat.Label>Total Budget</Stat.Label>
              <Stat.Number>${budgetProgress.total.toLocaleString()}</Stat.Number>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <Stat.Label>Spent</Stat.Label>
              <Stat.Number color="red.500">
                ${budgetProgress.spent.toLocaleString()}
              </Stat.Number>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <Stat.Label>Remaining</Stat.Label>
              <Stat.Number color="green.500">
                ${budgetProgress.remaining.toLocaleString()}
              </Stat.Number>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <Stat.Label>Budget Utilized</Stat.Label>
              <VStack align="stretch" spacing={2}>
                <Stat.Number>{budgetProgress.percentageUsed.toFixed(1)}%</Stat.Number>
                <Progress value={budgetProgress.percentageUsed} colorScheme="blue" borderRadius="full" />
              </VStack>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Monthly Expenses Trend</Heading>
          </CardHeader>
          <CardBody>
            <AreaChart width={chartWidth} height={chartHeight} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#3182CE" 
                fill="#3182CE" 
                fillOpacity={0.3} 
                name="Actual Expenses"
              />
              <Area 
                type="monotone" 
                dataKey="planned" 
                stroke="#805AD5" 
                fill="#805AD5" 
                fillOpacity={0.3}
                name="Planned Expenses" 
              />
            </AreaChart>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Expense Categories</Heading>
          </CardHeader>
          <CardBody>
            <PieChart width={chartWidth} height={chartHeight}>
              <Pie
                data={expenseCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={chartHeight / 3}
                label
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <Heading size="md">Recent Transactions</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
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
          </TableContainer>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Expenses;