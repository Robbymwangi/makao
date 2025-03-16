import React from "react";
import { Input, Button, VStack, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";
import AuthLayout from "/home/robby/makao/frontend/src/pages/AuthLayout";
import AuthHeader from "/home/robby/makao/frontend/src/usercomponents/Auth/AuthHeader";
import { Checkbox } from "@/components/ui/checkbox";

const SignUp = () => {
  return (
    <AuthLayout image="/assets/signup-bg.jpg">
      <VStack spacing={4} width="100%" maxW="400px">
        <AuthHeader />
        <Text fontSize="2xl" fontWeight="bold">Sign Up to Makao</Text>
        <Input placeholder="Full Name" />
        <Input placeholder="Email" />
        <Input placeholder="Password" type="password" />
        <Input placeholder="Confirm Password" type="password" />
        <Checkbox>I agree to the Terms of Service</Checkbox>
        <Button colorScheme="blackAlpha">Sign Up</Button>
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
