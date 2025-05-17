import React, { useState } from "react";
import { Stat, Flex, Text, HStack, Badge, Menu, Portal, useBreakpointValue } from "@chakra-ui/react";
import { LucideMenu, TrendingUp } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, Tooltip } from "recharts";
import { FormatNumber } from "@chakra-ui/react";

const FinancialHealth = () => {
  const [activeRange, setActiveRange] = useState("Monthly");
  const chartData = [
    { value: 65, month: "Jan" },
    { value: 78, month: "Feb" },
    { value: 82, month: "Mar" },
    { value: 75, month: "Apr" },
    { value: 89, month: "May" },
    { value: 93, month: "Jun" },
  ];


  const chartWidth = useBreakpointValue({ base: 370, md: 600 });

  return (
    <Stat.Root p={4} borderWidth="1px" borderRadius="sm" flex="1" boxShadow="sm">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">Financial Overview</Text>
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
              boxShadow={"0 2px 4px rgba(0, 0, 0, 0.1)"}
            >
              <LucideMenu size={16} />
              <Text>{activeRange}</Text>
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="200px" boxShadow="xl">
                <Menu.Item
                  onClick={() => setActiveRange("Last Month")}
                  _hover={{ bg: "gray.100" }}
                >
                  Last Month
                </Menu.Item>
                <Menu.Item
                  onClick={() => setActiveRange("Last 30 Days")}
                  _hover={{ bg: "gray.100" }}
                >
                  Last 30 Days
                </Menu.Item>
                <Menu.Item
                  onClick={() => setActiveRange("Last 3 Months")}
                  _hover={{ bg: "gray.100" }}
                >
                  Last 3 Months
                </Menu.Item>
                <Menu.Item
                  onClick={() => setActiveRange("Last Year")}
                  _hover={{ bg: "gray.100" }}
                >
                  Last Year
                </Menu.Item>
                <Menu.Item
                  onClick={() => setActiveRange("Monthly")}
                  _hover={{ bg: "gray.100" }}
                >
                  Monthly
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
      <HStack mb={4}>
        <Stat.ValueText fontSize="2xl">
          <FormatNumber value={84560} style="currency" currency="USD" />
        </Stat.ValueText>
        <Badge colorPalette="green" gap={1}>
          <TrendingUp size={16} />
          12%
        </Badge>
      </HStack>
      <AreaChart
        data={chartData}
        width={chartWidth}
        height={200}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#2ED4A9" fill="#E6FFFA" strokeWidth={2} />
      </AreaChart>
    </Stat.Root>
  );
};

export default FinancialHealth;