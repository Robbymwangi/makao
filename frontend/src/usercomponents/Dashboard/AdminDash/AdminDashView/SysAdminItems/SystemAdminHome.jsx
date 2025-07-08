import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Text, VStack, Spinner } from "@chakra-ui/react";
import supabase from "@/utils/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore"; // <-- Use your actual auth store

const SystemAdminHome = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual user id retrieval
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("admins")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setAdmin(data);
      }
      setLoading(false);
    };
    fetchAdmin();
  }, [user]);

  return (
    <Box p={6}>
      {/* Header Section */}
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        direction={{ base: "column", md: "row" }}
      >
        <Heading
          size="2xl"
          fontWeight="bold"
          fontFamily="'Playfair Display', serif"
        >
          System Administration
        </Heading>
      </Flex>
      <VStack spacing={4} align="start">
        {loading ? (
          <Spinner />
        ) : admin ? (
          <Text
            fontSize="2xl" // Increased font size
            color="gray.700"
            fontWeight="medium"
            fontFamily="'Playfair Display', serif"
            lineHeight="tall"
            bg="gray.50"
            px={5}
            py={3}
            borderRadius="md"
            boxShadow="sm"
          >
            Welcome back,{" "}
            <Text as="span" fontWeight="bold" display="inline">
              {admin.full_name || "Admin"}
            </Text>
            . You are logged in as:{" "}
            <Text as="span" fontWeight="bold" display="inline">
              {admin.role}
            </Text>
          </Text>
        ) : (
          <Text fontSize="lg" color="red.500">
            Admin details not found.
          </Text>
        )}
      </VStack>
      {/* Everything else is commented out */}
      {/*
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        ...
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        ...
      </SimpleGrid>
      */}
    </Box>
  );
};

export default SystemAdminHome;
