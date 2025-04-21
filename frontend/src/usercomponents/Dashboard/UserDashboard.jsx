"use client";
import React, { useState } from "react";
import { 
  Box, 
  Text, 
  Flex, 
  VStack, 
  HStack, 
  Avatar, 
  Badge, 
  Stat, 
  SimpleGrid, 
  useBreakpointValue,
  FormatNumber,
  Timeline,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { 
  Check, 
  Clock, 
  DollarSign, 
  Image, 
  Link2, 
  LucideMenu, 
  MessageSquare,
  Plus,
  TrendingUp
} from "lucide-react";
import DashLayout from "@/pages/DashLayout";
import { Chart, useChart } from "@chakra-ui/charts";
import { AreaChart, Area, CartesianGrid, XAxis, Tooltip } from "recharts";

const UserDashboard = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeRange, setActiveRange] = useState("Monthly"); // State to track the active range
  const chartData = [
    { value: 65, month: "Jan" },
    { value: 78, month: "Feb" },
    { value: 82, month: "Mar" },
    { value: 75, month: "Apr" },
    { value: 89, month: "May" },
    { value: 93, month: "Jun" },
  ];

  return (
    <DashLayout userName="Robby">
      <VStack spacing={{ base: 8, md: 12 }} align="fill">
        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
          <Stat.Root p={4} borderWidth="1px" borderRadius="xl">
            <HStack spacing={4} mb={3}>
              <Clock size={20} />
              <Stat.Label>Current Phase</Stat.Label>
            </HStack>
            <Stat.ValueText fontSize="2xl">Foundation Work</Stat.ValueText>
            <Stat.HelpText mt={2}>Due in 14 days</Stat.HelpText>
          </Stat.Root>

          <Stat.Root p={4} borderWidth="1px" borderRadius="xl">
            <HStack spacing={4} mb={3}>
              <Check size={20} />
              <Stat.Label>Next Milestone</Stat.Label>
            </HStack>
            <Stat.ValueText fontSize="2xl">Wall Completion</Stat.ValueText>
            <Stat.HelpText mt={2}>80% completed</Stat.HelpText>
          </Stat.Root>

          <Stat.Root p={4} borderWidth="1px" borderRadius="xl">
            <HStack spacing={4} mb={3}>
              <Check size={20} />
              <Stat.Label>Financial Health</Stat.Label>
            </HStack>
            <Stat.ValueText>
              <FormatNumber value={8456.4} style="currency" currency="USD" />
            </Stat.ValueText>
            <Badge colorPalette="green" gap="0" alignSelf="start">
              <Stat.UpIndicator />
              12%
            </Badge>
            <Stat.HelpText mt={2}>80% completed</Stat.HelpText>
          </Stat.Root>
        </SimpleGrid>

        {/* Timeline and Financial Health Side by Side */}
        <HStack
          spacing={8}
          align="start"
          divideX="1px"
          divideColor="gray.200"
          flexWrap={{ base: "wrap", md: "nowrap" }}
          mt={8}
        >
          {/* Financial Health */}
          <Stat.Root 
            p={4} 
            borderWidth="1px" 
            borderRadius="xl" 
            flex="1"
          >
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
                    <Text>{activeRange}</Text> {/* Display the active range */}
                  </Flex>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="200px" boxShadow="xl">
                      <Menu.Item onClick={() => setActiveRange("Last Month")}>
                        Last Month
                      </Menu.Item>
                      <Menu.Item onClick={() => setActiveRange("Last 30 Days")}>
                        Last 30 Days
                      </Menu.Item>
                      <Menu.Item onClick={() => setActiveRange("Last 3 Months")}>
                        Last 3 Months
                      </Menu.Item>
                      <Menu.Item onClick={() => setActiveRange("Last Year")}>
                        Last Year
                      </Menu.Item>
                      <Menu.Item onClick={() => setActiveRange("Monthly")}>
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
            <Chart.Root 
              h={200} w="full"
              chart={useChart({ 
                data: chartData, 
                series: [{ name: "value", color: "green.solid" }] 
              })}
            >
              <AreaChart 
                data={chartData}
                width={isMobile ? 300 : 600} 
                height={200}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2ED4A9" 
                  fill="#E6FFFA" 
                  strokeWidth={2}
                />
              </AreaChart>
            </Chart.Root>
          </Stat.Root>
          
          {/* Timeline */}
          <Box p={4} h={"345px"} borderWidth="1px" borderRadius="xl" flex="1">
            <Text fontSize="lg" fontWeight="semibold" mb={6}>Project Timeline</Text>
            <Timeline.Root variant="subtle">
              <Timeline.Item>
                <Timeline.Connector>
                  <Timeline.Separator />
                  <Timeline.Indicator>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name="R" />
                    </Avatar.Root>
                  </Timeline.Indicator>
                </Timeline.Connector>
                <Timeline.Content>
                  <Timeline.Title>Foundation Inspection Passed</Timeline.Title>
                  <Timeline.Description mt={1}>3 days ago</Timeline.Description>
                </Timeline.Content>
              </Timeline.Item>

              <Timeline.Item>
                <Timeline.Connector>
                  <Timeline.Separator />
                  <Timeline.Indicator>
                    <Check size={16} />
                  </Timeline.Indicator>
                </Timeline.Connector>
                <Timeline.Content>
                  <Timeline.Title>Plumbing Rough-In Approved</Timeline.Title>
                  <Timeline.Description mt={1}>Next week</Timeline.Description>
                </Timeline.Content>
              </Timeline.Item>
            </Timeline.Root>
          </Box>
        </HStack>

        {/* Photo Progress */}
        <Box p={4} borderWidth="1px" borderRadius="xl" w="full" mt={12} mb={12}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Photo Progress</Text>
            <Flex
              as="button"
              align="center"
              gap={2}
              px={4}
              py={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <Plus size={16} />
              <Text>See All Reports</Text>
            </Flex>
          </Flex>
          <HStack spacing={6} overflowX="auto" pb={2}>
            {["3 weeks ago", "2 months ago", "3 months ago"].map((label) => (
              <Box
                key={label}
                minW="240px" 
                borderWidth="1px"
                borderRadius="xl"
                p={4} 
                flexShrink={0}
              >
                <Box bg="gray.100" h="160px" borderRadius="md" mb={4} /> 
                <HStack spacing={2}>
                  <Image size={16} />
                  <Text fontSize="sm">{label}</Text>
                </HStack>
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Quick Links Grid */}
        <VStack align="stretch" spacing={6} mb={12}> 
          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold">Quick Links</Text>
            <Flex 
              as="button" 
              align="center" 
              gap={2} 
              px={4} 
              py={2} 
              borderRadius="md" 
              _hover={{ bg: "gray.100" }}
            >
              <Plus size={16} />
              <Text>Add Link</Text>
            </Flex>
          </Flex>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Flex
                key={i}
                p={4}
                borderWidth="1px"
                borderRadius="xl"
                align="center"
                gap={4}
                _hover={{ bg: "gray.50" }}
              >
                <Link2 size={20} />
                <Text>Document {i}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Agent Comment */}
        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="xl" 
          w="full" 
          h="250px" 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="start" 
        >
          <Text fontSize="lg" fontWeight="semibold" mb={4} alignSelf="start">Agent's Summary</Text>
          <Flex gap={6} direction={{ base: "column", md: "row" }} align="start">
            <HStack spacing={4} flex={1}>
              <Avatar.Root>
                <Avatar.Fallback name="Agent" />
              </Avatar.Root>
              <VStack align="start" spacing={0}> 
                <Text fontWeight="semibold">Construction Supervisor</Text>
                <Text fontSize="sm" color="gray.500">Last updated 2 days ago</Text>
              </VStack>
            </HStack>
            <Badge colorPalette="green" alignSelf="start">Good Progress</Badge>
          </Flex>
          
          <HStack spacing={6} align="start" mt={4}> 
            <MessageSquare size={isMobile ? 35 : 20} />
            <Text textAlign="center">
              Foundation work is progressing well. Ensure proper curing process 
              is maintained for the next 72 hours.
            </Text>
          </HStack>
        </Box>
      </VStack>
    </DashLayout>
  );
};

export default UserDashboard;