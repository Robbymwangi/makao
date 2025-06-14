import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { VStack, HStack, Text, Heading } from "@chakra-ui/react";
import { getMenuByRole } from "@/utils/menuUtils";

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Fetch menu items dynamically based on the role
    const fetchedMenuItems = getMenuByRole(role);
    setMenuItems(fetchedMenuItems);
  }, [role]);

  return (
    <VStack spacing={6} align="stretch">
      <Heading fontSize="4xl" fontWeight="bold">Admin Dashboard</Heading>
      <Text fontSize="xl">You are logged in as: <strong>{role}</strong></Text>
      <HStack spacing={6}>
        {menuItems.map((item) => (
          <Text
            key={item.label}
            fontSize="lg"
            fontWeight="bold"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            {item.label}
          </Text>
        ))}
      </HStack>
      {/* Add other admin dashboard components here */}
    </VStack>
  );
};

export default AdminDashboard;