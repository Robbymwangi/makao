import React, { useState } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/utils/supabaseClient";

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
    // Step 1: Sign in with password
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError || !data?.user) {
      setError("Invalid email or password.");
      return;
    }

    const role = data.user.user_metadata?.role;
    if (role !== "user") {
      setError("Access denied. This login is for users only.");
      await supabase.auth.signOut();
      return;
    }

    // Step 2: Sign out immediately
    await supabase.auth.signOut();

    // Step 3: Send OTP to email
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/otp-challengeresp`,
      },
    });

    if (otpError) {
      setError("Failed to send OTP. Please check your email.");
      return;
    }

    // Save email to Zustand or localStorage
    login({ email: normalizedEmail });

    // Step 4: Redirect to OTP entry screen
    navigate("/otp-challengesend");

  } catch (err) {
    console.error("Login error:", err);
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