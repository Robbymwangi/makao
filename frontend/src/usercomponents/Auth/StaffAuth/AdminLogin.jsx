import React, { useState, useEffect } from "react";
import { Box, VStack, Input, Button, Text, Link, Flex } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";
import { useSearchParams } from "react-router-dom";
import supabase from "@/utils/supabaseClient";


const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loading, error, clearError, setEmailStore } = useAuthStore();

// Show success toast if email was confirmed
  useEffect(() => {
    if (searchParams.get("confirmed") === "true") {
      toaster.create({
        title: "Email Confirmed",
        description: "Your email has been confirmed successfully. You can now log in.",
        type: "success",
        duration: 5000,
      });
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toaster.create({
        title: "Validation Error",
        description: "Please enter both email and password",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.message.includes("email not confirmed") ||
        error.message.includes("confirm your email")
      ) {
        toaster.create({
          title: "Email Not Confirmed",
          description: "Please confirm your email before logging in.",
          type: "warning",
          duration: 5000,
        });

        localStorage.setItem("pendingConfirmationEmail", email);
        return navigate("/auth/confirm");
      }

      return toaster.create({
        title: "Login Failed",
        description: error.message || "Invalid credentials.",
        type: "error",
        duration: 4000,
      });
    }

    const user = data?.user;
    const role = user?.user_metadata?.role;

    if (["systemAdmin", "consultantAdmin", "agentAdmin"].includes(role)) {
      // Save session info
      login({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "Staff",
        role,
      });

      setEmailStore(email); // For OTP resend
      toaster.create({
        title: "Login Successful",
        description: "Welcome back!",
        type: "success",
        duration: 2000,
      });

      navigate("/staff/otp-challengesend");
    } else {
      toaster.create({
        title: "Access Denied",
        description: "You are not authorized for staff login.",
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