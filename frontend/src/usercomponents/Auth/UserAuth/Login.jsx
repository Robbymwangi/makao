import React, { useState, useEffect } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, error, clearError } = useAuthStore();

  // Check for email confirmation success
  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      toaster.create({
        title: "Email Confirmed",
        description: "Your email has been confirmed successfully! You can now log in.",
        type: "success",
        duration: 5000,
      });
    }
  }, [searchParams]);

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
      
      toaster.create({
        title: "Login Successful",
        description: "Welcome back!",
        type: "success",
        duration: 2000,
      });

      // Navigate based on role
      if (role === "user") {
        navigate("/otp-challengesend");
      } else if (["systemAdmin", "consultantAdmin", "agentAdmin"].includes(role)) {
        navigate("/staff/otp-challengesend");
      } else {
        navigate("/dashboard");
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
    <AuthLayout 
      image="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3" 
      leftContent="Your dream home is one login away"
    >
      <VStack spacing={6} width="100%" maxW="500px">
        <Box mb={6} w="100%">
          <AuthHeader />
        </Box>
        <Text fontSize="2xl" fontWeight="bold">Log In</Text>
        <form style={{ width: "100%" }} onSubmit={handleLogin}>
          <VStack spacing={4} w="100%">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="login-email"
              name="login-email"
              type="email"
              required
              disabled={loading}
            />
            <Input
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="login-password"
              name="login-password"
              type="password"
              required
              disabled={loading}
            />
            <Button 
              colorScheme="blue" 
              type="submit" 
              w="100%"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </VStack>
        </form>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
        <Text>
          Don't have an account?{" "}
          <Link variant="underline" asChild>
            <RouterLink to="/signup">Sign Up</RouterLink>
          </Link>
        </Text>
        <Text>
          <Link variant="underline" asChild>
            <RouterLink to="/forgot-password">Forgot Password?</RouterLink>
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default Login;