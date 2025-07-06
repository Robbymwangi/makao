import React, { useState, useEffect } from "react";
import { Box, VStack, Input, Button, Text, Link, Flex, Spinner } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient"; // <-- Make sure this import is present

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, error, clearError, setEmailStore } = useAuthStore();

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
    clearError();
    setLoading(true);

    if (!email || !password) {
      toaster.create({
        title: "Validation Error",
        description: "Please enter both email and password",
        type: "error",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/staff-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.code === "pending_verification") {
          localStorage.setItem("pendingConfirmationEmail", email);
          toaster.create({
            title: "Email Not Confirmed",
            description: "Please confirm your email before logging in.",
            type: "warning",
            duration: 5000,
          });
          setLoading(false);
          return navigate("/auth/confirm");
        }

        toaster.create({
          title: "Login Failed",
          description: result.error || "Invalid credentials.",
          type: "error",
          duration: 4000,
        });
        setLoading(false);
        return;
      }

      const { user, session, role } = result;

      if (["systemAdmin", "consultantAdmin", "agentAdmin"].includes(role)) {
        // 1. Sync Supabase session in browser for Edge Function auth!
        if (session) {
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        }

        // 2. Set your store as before
        useAuthStore.setState({
          isAuthenticated: true,
          user: user,
          role: role,
          token: session.access_token,
          loading: false,
          error: null
        });

        localStorage.setItem(
          "supabase.auth.token",
          JSON.stringify({
            user,
            access_token: session.access_token,
          })
        );

        setEmailStore(email);

        toaster.create({
          title: "Login Successful",
          description: "Welcome back!",
          type: "success",
          duration: 2000,
        });

        // Redirect to admin dashboard
        navigate("/admin-dashboard", { replace: true });

      } else {
        toaster.create({
          title: "Access Denied",
          description: "You are not authorized for staff login.",
          type: "error",
          duration: 4000,
        });
      }
    } catch (err) {
      toaster.create({
        title: "Login Error",
        description: err.message || "An unexpected error occurred.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
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
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              colorScheme="blackAlpha"
              w="100%"
              type="submit"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Log In"}
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
