import React from "react";
import { Input, Button, VStack, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";
import AuthLayout from "/home/robby/makao/frontend/src/pages/AuthLayout";
import AuthHeader from "/home/robby/makao/frontend/src/usercomponents/Auth/AuthHeader";

const Login = () => {
  return (
    <AuthLayout 
      image="/assets/login-bg.jpg" 
      leftContent="Your dream home is one login away"
    >
      <VStack spacing={6} width="100%" maxW="400px">
        <AuthHeader />
        <Text fontSize="2xl" fontWeight="bold">Log In</Text>
        <Input placeholder="Enter your email" />
        <Input placeholder="Enter your password" type="password" />
        <Button colorScheme="blackAlpha">Log In</Button>
        <Text>
          Don't have an account?{" "}
          <Link variant="underline" asChild>
            <RouterLink to="/SignUp">Sign Up</RouterLink>
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
