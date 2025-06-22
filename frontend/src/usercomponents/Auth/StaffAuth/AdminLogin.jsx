import React, { useState } from "react";
import { Box, VStack, Input, Button, Text, Link, Flex } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      toaster.create({
        title: "Validation Error",
        description: "Please enter both email and password",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const role = await login(email, password);
      
      // Check if the user has a staff role
      if (["systemAdmin", "consultantAdmin", "agentAdmin"].includes(role)) {
        toaster.create({
          title: "Login Successful",
          description: "Welcome to the staff portal!",
          type: "success",
          duration: 2000,
        });
        navigate("/staff/otp-challengesend");
      } else if (role === "user") {
        toaster.create({
          title: "Access Denied",
          description: "Users must use the regular Login page.",
          type: "error",
          duration: 4000,
        });
        // Clear the authentication since this is not a valid staff login
        useAuthStore.getState().logout();
      } else {
        toaster.create({
          title: "Access Denied",
          description: "You don't have permission to access the staff portal.",
          type: "error",
          duration: 4000,
        });
        // Clear the authentication
        useAuthStore.getState().logout();
      }
    } catch (error) {
      toaster.create({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  return (
    <Flex minH="100vh" direction="column" bg="gray.50" justify="center" align="center">
      <Box w="100%" maxW="400px" bg="white" p={{ base: 4, md: 8 }} borderRadius="lg" boxShadow="md" mt={12}>
        <AuthHeader />
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Staff Login
        </Text>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <Input 
              placeholder="Staff Email" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input 
              placeholder="Password" 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button 
              colorScheme="blackAlpha" 
              w="100%" 
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </VStack>
        </form>
        {error && (
          <Text color="red.500" mt={2} textAlign="center" fontSize="sm">
            {error}
          </Text>
        )}
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