import React from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/AuthHeader";
import { Checkbox } from "@/components/ui/checkbox";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Add signup logic here
    navigate("/otp-challengesend"); // Redirect to OTP challenge send page
  };

  return (
    <AuthLayout 
      image="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3" 
      leftContent="Join us and start your journey"
    >
      <VStack spacing={6} width="100%" maxW="400px">
        <Box mb={6} w="100%">
          <AuthHeader />
        </Box>
        <Text fontSize="2xl" fontWeight="bold">Sign Up for Makao</Text>
        <Input placeholder="Full Name" />
        <Input placeholder="Email" />
        <Input placeholder="Password" type="password" />
        <Input placeholder="Confirm Password" type="password" />
        <Checkbox>I agree to the Terms of Service</Checkbox>
        <Button colorScheme="blackAlpha" width="100%" onClick={handleSignUp}>
          Sign Up
        </Button>
        <Text>
          Already have an account?{" "}
          <Link variant="underline" asChild>
            <RouterLink to="/login">Log In</RouterLink>
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default SignUp;