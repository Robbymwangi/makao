import React, { useState } from "react";
import { Box, VStack, Text, Button, Heading, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const resendConfirmation = useAuthStore((state) => state.resendConfirmation);

  // Get the pending email from localStorage
  const email = localStorage.getItem("pendingConfirmationEmail");

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await resendConfirmation(email);
      setMessage(res.message || "Confirmation email sent successfully.");
    } catch (err) {
      setError(err.message || "Failed to resend confirmation email.");
    } finally {
      setLoading(false);
    }
  };

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
          <Heading size="lg" color="orange.500" textAlign="center">
            Email Not Confirmed
          </Heading>
          <Text color="gray.600" textAlign="center">
            {email
              ? `A verification email was sent to ${email}. Please check your inbox and spam folder.`
              : "A verification email was sent. Please check your inbox and spam folder."}
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleResend}
            isLoading={loading}
            loadingText="Resending..."
            w="100%"
            disabled={!email}
          >
            Resend Verification Email
          </Button>
          {message && <Text color="green.500" fontSize="sm">{message}</Text>}
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/login")}
            w="100%"
          >
            Back to Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ConfirmEmail;
