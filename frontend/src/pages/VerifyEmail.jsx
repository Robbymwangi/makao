import React from "react";
import { Box, VStack, Text, Button, Heading } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const isError = !!errorCode || !!errorDescription;

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
        <VStack spacing={6}>
          <AuthHeader />
          {isError ? (
            <VStack spacing={6} textAlign="center">
              <XCircle size={64} color="#F56565" />
              <Heading size="lg" color="red.600">
                Verification Failed
              </Heading>
              <Text color="gray.600">
                {errorDescription || "The verification link is invalid or has expired. Please request a new confirmation email."}
              </Text>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Back to Sign Up
              </Button>
            </VStack>
          ) : (
            <VStack spacing={6} textAlign="center">
              <CheckCircle size={64} color="#48BB78" />
              <Heading size="lg" color="green.600">
                Email Verified!
              </Heading>
              <Text color="gray.600">
                Your email address has been verified. You can now log in to your account.
              </Text>
              <Button
                colorScheme="green"
                size="lg"
                onClick={() => {
                  localStorage.removeItem('pendingConfirmationEmail');
                  navigate('/login?confirmed=true');
                }}
              >
                Continue to Login
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default VerifyEmail;