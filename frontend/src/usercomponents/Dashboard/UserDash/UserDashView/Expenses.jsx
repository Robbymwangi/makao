"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Dialog,
  VStack,
  Spinner,
  HStack,
  Flex,
  SimpleGrid,
  Stat,
  useBreakpointValue,
  Menu,
  Portal,
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
import { getProjectStatus, submitProjectApproval } from "@/api/projectApproval";
import { useAuthStore } from "@/store/useAuthStore";
import ProjectApprovalForm from "@/usercomponents/Dashboard/UserDash/UserDashComponents/ProjectsComponents/ProjectApprovalForm";
import supabase from "@/utils/supabaseClient";
import { useParams } from "react-router"; // or your routing solution

// ExpensesList component for Team Expenses (color bullets)
const ExpensesList = ({ data }) => {
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
              KES {item.value.toLocaleString()}{" "}
              <Text as="span" fontWeight="normal" color="gray.500" fontSize="xs">
                ({percent}%)
              </Text>
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
};

// ReceiptsList component for Receipts (with additional columns)
const ReceiptsList = ({ data }) => {
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
            KES {item.cost.toLocaleString()}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
};

// Main Expenses component
const EDGE_URL = "https://plkrxatjphebkphmhvze.supabase.co/functions/v1/check-user-projects";

const Expenses = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [loadingTimelines, setLoadingTimelines] = useState(true);
  const jwt = useAuthStore((state) => state.token);
  const { id: projectId } = useParams();

  const isMobile = useBreakpointValue({ base: true, md: false }); // <-- Add this line


  const estimatedActualChartData = timelines.map(tl => ({
    milestone: tl.title,
    estimated: Number(tl.estimated_cost) || 0,
    actual: Number(tl.actual_expenditure) || 0,
  }));

  const estimatedActualChart = useChart({
    data: estimatedActualChartData,
    series: [
      { name: "estimated", color: "blue.solid" },
      { name: "actual", color: "green.solid" },
    ],
  });

  // Pie chart for total estimated vs actual
  const totalEstimated = timelines.reduce((sum, tl) => sum + (Number(tl.estimated_cost) || 0), 0);
  const totalActual = timelines.reduce((sum, tl) => sum + (Number(tl.actual_expenditure) || 0), 0);

  const pieChartData = [
    { name: "Estimated", value: totalEstimated, color: "#3182CE" },
    { name: "Actual", value: totalActual, color: "#38A169" },
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

  const receiptsData = timelines.map((tl, idx) => ({
    invoiceId: tl.title || `#${idx + 1}`,
    company: tl.contractor || "N/A",
    date: tl.date ? new Date(tl.date).toLocaleDateString() : "",
    cost: Number(tl.actual_expenditure) || 0,
  }));

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    setError("");
    fetch(EDGE_URL, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
        setUserProjects(data.existingProjects || []);
      })
      .catch((err) => setError(err.message || "Failed to load project status"))
      .finally(() => setLoading(false));
  }, [jwt]);

  useEffect(() => {
    if (!projectId) return;
    setLoadingTimelines(true);
    supabase
      .from("project_timelines")
      .select("*")
      .eq("project_id", projectId)
      .order("date", { ascending: true })
      .then(({ data, error }) => {
        if (!error) setTimelines(data || []);
        setLoadingTimelines(false);
      });
  }, [projectId]);

  const handleFormSubmit = async (formData) => {
    // You may want to call your submitProjectApproval here if needed
    setIsFormOpen(false);
    setLoading(true);
    fetch(EDGE_URL, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setShowSubmissionOverlay(data.shouldShowSubmissionOverlay);
        setUserProjects(data.existingProjects || []);
      })
      .finally(() => setLoading(false));
  };

  function EstimatedActualChart({ chart }) {
    return (
      <Chart.Root maxH="md" chart={chart}>
        <BarChart data={chart.data}>
          <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
          <XAxis
            tickLine={false}
            dataKey={chart.key("milestone")}
            stroke={chart.color("border")}
          />
          <YAxis
            tickLine={false}
            stroke={chart.color("border")}
            tickFormatter={v => `KES ${v.toLocaleString()}`}
          />
          <Tooltip
            cursor={{ fill: chart.color("bg.muted") }}
            animationDuration={100}
            content={({ payload, label }) => (
              <Box p={2}>
                <Text fontWeight="bold">{label}</Text>
                {payload &&
                  payload.map((entry, idx) => (
                    <Text key={idx} color={entry.color}>
                      {entry.name}: KES {Number(entry.value).toLocaleString()}
                    </Text>
                  ))}
              </Box>
            )}
          />
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
              barSize={58}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </Chart.Root>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        textAlign="center"
        p={8}
      >
        <Spinner size="xl" color="black" />
        <Text mt={4}>Loading...</Text>
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" p={8}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (showSubmissionOverlay) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        textAlign="center"
        p={8}
      >
        <Box maxW="lg" width="100%">
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            mb={2}
            color="gray.800"
          >
            Project Approval
          </Text>
          <Text
            fontSize="lg"
            color="gray.700"
            mb={4}
          >
            Please fill in your project details below to request approval and gain
            full access to the platform. All information will be reviewed by our
            team.
          </Text>
        </Box>
        <Button colorScheme="blue" mt={4} onClick={() => setIsFormOpen(true)}>
          Submit Project Details
        </Button>
        <Dialog.Root
          open={isFormOpen}
          onOpenChange={(details) => setIsFormOpen(details.open)}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content maxW="lg">
                <Dialog.Header>
                  <Dialog.Title>Submit Project Details</Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <Button onClick={() => setIsFormOpen(false)}>Close</Button>
                  </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body>
                  <ProjectApprovalForm
                    loading={loading}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Box>
    );
  }

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
        </Flex>

        {/* Main Content Section */}
        <Flex direction={{ base: "column", md: "row" }} gap={4} alignItems="flex-start">
          {/* The Construction Expenses Overview and Expense Distribution boxes have been removed */}
        </Flex>

        {/* Grid Section */}
        <SimpleGrid columns={{ base: 1, md: 1 }} columnGap={6} rowGap={6} mt={8}>
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
          <EstimatedActualChart chart={estimatedActualChart} />
          <Text fontSize="sm" color="gray.600" mt={6}>
            This chart shows the estimated versus actual expenses per month for your project.
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default Expenses;