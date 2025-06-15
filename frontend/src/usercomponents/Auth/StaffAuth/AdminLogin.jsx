import React, { useState } from "react";
import { Box, VStack, Input, Button, Text, Link, Flex } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e) => {
    e.preventDefault();
    const role = login(email);
    if (role === "systemAdmin" || role === "consultantAdmin" || role === "agentAdmin") {
      setError("");
      navigate("/staff/otp-challengesend");
    } else if (role === "user") {
      setError("Users must use the regular Login page.");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Flex minH="100vh" direction="column" bg="gray.50" justify="center" align="center">
      <Box w="100%" maxW="400px" bg="white" p={{ base: 4, md: 8 }} borderRadius="lg" boxShadow="md" mt={12}>
        <AuthHeader />
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Staff Login
        </Text>
        <VStack spacing={4} as="form" onSubmit={handleLogin}>
          <Input placeholder="Staff Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} id="staff-email" name="staff-email" />
          <Input placeholder="Password" type="password" required id="staff-password" name="staff-password" />
          <Button colorScheme="blackAlpha" w="100%" type="submit">
            Log In
          </Button>
        </VStack>
        {error && <Text color="red.500" mt={2} textAlign="center">{error}</Text>}
        <Text mt={4} textAlign="center">
          <Link as={RouterLink} to="/staff/forgot-password" color="blue.500" fontWeight="medium">
            Forgot Password?
          </Link>
        </Text>
      </Box>
      <Box as="footer" w="100%" textAlign="center" py={4} color="gray.500" fontSize="sm" mt={8}>
        &copy; {new Date().getFullYear()} Makao Staff Portal. All rights reserved.
      </Box>
    </Flex>
  );
};

export default StaffLogin;