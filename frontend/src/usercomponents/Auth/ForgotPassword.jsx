import React from "react";
import { Input, Button, VStack, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";
import AuthLayout from "/home/robby/makao/frontend/src/pages/AuthLayout";
import AuthHeader from "/home/robby/makao/frontend/src/usercomponents/Auth/AuthHeader";

const ForgotPassword = () => {
  return (
    <AuthLayout image="/assets/forgot-password-bg.jpg" vertical={true}>
      <VStack spacing={4} width="100%" maxW="400px">
        <AuthHeader />
        <Text fontSize="2xl" fontWeight="bold">Reset Your Password</Text>
        <Text>Enter your email to receive reset instructions.</Text>
        <Input placeholder="Your email address" />
        <Button colorScheme="blackAlpha">Send Reset Instructions</Button>
        <Text>
          <Link variant="underline" asChild>
            <RouterLink to="/login">Back to Login</RouterLink>
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default ForgotPassword;
