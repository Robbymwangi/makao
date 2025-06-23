import React from "react";
import { Box, VStack, Text, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4} display="flex" alignItems="center" justifyContent="center">
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
        maxW="md"
        w="100%"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <VStack spacing={6} textAlign="center">
          <CheckCircle size={64} color="#48BB78" />
          <Heading size="lg" color="green.600">
            Email Verified Successfully!
          </Heading>
          <Text color="gray.600" maxW="md">
            Your email has been verified. You can now log in.
          </Text>
          <Button colorScheme="green" size="lg" onClick={() => navigate("/login")} mt={4}>
            Continue to Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
