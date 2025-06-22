import React, { useState } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/utils/supabaseClient";
import { toaster, Toaster } from "@/components/ui/toaster";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
 
const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    const normalizedEmail = email.trim().toLowerCase();

   try {
      const loginPromise = supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      const { data: loginData, error: loginError } = await toaster.promise(loginPromise, {
        loading: {
          title: "Logging in",
          description: "Authenticating credentials...",
        },
        success: {
          title: "Login Successful",
          description: "Sending OTP to your email...",
        },
        error: {
          title: "Login Failed",
          description: "Invalid email or password.",
        },
      });

      if (loginError || !loginData?.user) return;

      const user = loginData.user;
      const role = user.user_metadata?.role;

      if (role !== "user") {
        setError("Access denied. This login is for users only.");
        return;
      }

      // Send OTP after successful password login
      const otpPromise = supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/otp-challengeresp`,
        },
      });

      await toaster.promise(otpPromise, {
        loading: {
          title: "Sending OTP",
          description: "Please wait while we send your verification code",
        },
        success: {
          title: "OTP Sent",
          description: `Code sent to ${normalizedEmail}`,
        },
        error: {
          title: "OTP Send Failed",
          description: "Could not send verification code.",
        },
      });

      login({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "User",
        role,
      });

      navigate("/otp-challengesend", { state: { otpMethod: "email" } });
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("Something went wrong. Please try again.");
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
            />
            <Input
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="login-password"
              name="login-password"
              type="password"
              required
            />
            <Button colorScheme="blue" type="submit" w="100%">
              Log In
            </Button>
          </VStack>
        </form>
        {error && <Text color="red.500">{error}</Text>}
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