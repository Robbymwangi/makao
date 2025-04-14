import React from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/AuthHeader";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add login logic here
    navigate("/otp-challengesend"); // Redirect to OTP challenge send page
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
        <Input placeholder="Enter your email" />
        <Input placeholder="Enter your password" type="password" />
        <Button colorScheme="blackAlpha" width="100%" onClick={handleLogin}>
          Log In
        </Button>
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