import React from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";

const ForgotPassword = () => {
  return (
    <AuthLayout 
      image="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3" 
      vertical={true}
    >
      <VStack spacing={6} width="100%" maxW="400px">
        {/* AuthHeader at the top of the box */}
        <Box mb={6} w="100%">
          <AuthHeader />
        </Box>
        <Text fontSize="2xl" fontWeight="bold">Reset Your Password</Text>
        <Text>Enter your email to receive reset instructions.</Text>
        <Input placeholder="Your email address" />
        <Button colorScheme="blackAlpha" width="100%">Send Reset Instructions</Button>
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