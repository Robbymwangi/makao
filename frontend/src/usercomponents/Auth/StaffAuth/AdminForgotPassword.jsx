import React from "react";
import { Box, VStack, Input, Button, Text, Link, Flex } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";

const StaffForgotPassword = () => {
  const navigate = useNavigate();

  const handleForgot = (e) => {
    e.preventDefault();
    // Go to staff OTP send after requesting reset
    navigate("/staff/otp-challengesend");
  };

  return (
    <Flex minH="100vh" direction="column" bg="gray.50" justify="center" align="center">
      <Box w="100%" maxW="400px" bg="white" p={{ base: 4, md: 8 }} borderRadius="lg" boxShadow="md" mt={12}>
        <AuthHeader />
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Staff Password Reset
        </Text>
        <Text mb={4} color="gray.600" textAlign="center">
          Enter your staff email to receive reset instructions.
        </Text>
        <VStack spacing={4} as="form" onSubmit={handleForgot}>
          <Input placeholder="Staff Email" type="email" required id="staff-email" name="staff-email" />
          <Button colorScheme="blackAlpha" w="100%" type="submit">
            Send Reset Instructions
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          <Link as={RouterLink} to="/staff/login" color="blue.500" fontWeight="medium">
            Back to Login
          </Link>
        </Text>
      </Box>
      <Box as="footer" w="100%" textAlign="center" py={4} color="gray.500" fontSize="sm" mt={8}>
        &copy; {new Date().getFullYear()} Makao Staff Portal. All rights reserved.
      </Box>
    </Flex>
  );
};

export default StaffForgotPassword;