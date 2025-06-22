import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Heading, Spinner, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  // Helper to parse the hash string (e.g. #type=signup&token_hash=abc123)
  const parseHashParams = () => {
    const hash = window.location.hash.substring(1); // remove the #
    return new URLSearchParams(hash);
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const hashParams = parseHashParams();
        const tokenHash = hashParams.get("token_hash");
        const type = hashParams.get("type");

        console.log("Parsed from hash:", { tokenHash, type });

        if (!tokenHash || !type) {
          setStatus("error");
          setMessage("Invalid verification link. Missing required parameters.");
          return;
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type,
        });

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
          setMessage(`Email verification failed: ${error.message}`);
          return;
        }

        if (data?.user) {
          console.log("Email verified for user:", data.user.id);
          setStatus("success");
          setMessage("Your email has been verified successfully! You can now log in.");
          toaster.create({
            title: "Email Verified",
            description: "Your email has been confirmed successfully!",
            type: "success",
            duration: 5000,
          });
        } else {
          setStatus("error");
          setMessage("Verification failed. No user information returned.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("error");
        setMessage("Something went wrong during email verification.");
      }
    };

    verifyEmail();
  }, []);

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <VStack spacing={6} textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Heading size="lg">Verifying your email...</Heading>
            <Text color="gray.600">
              Please wait while we confirm your email address.
            </Text>
          </VStack>
        );
      case "success":
        return (
          <VStack spacing={6} textAlign="center">
            <CheckCircle size={64} color="#48BB78" />
            <Heading size="lg" color="green.600">
              Email Verified Successfully!
            </Heading>
            <Text color="gray.600" maxW="md">
              {message}
            </Text>
            <Button colorScheme="green" size="lg" onClick={() => navigate("/login")} mt={4}>
              Continue to Login
            </Button>
          </VStack>
        );
      case "error":
        return (
          <VStack spacing={6} textAlign="center">
            <XCircle size={64} color="#F56565" />
            <Heading size="lg" color="red.600">
              Verification Failed
            </Heading>
            <Text color="gray.600" maxW="md">
              {message}
            </Text>
            <VStack spacing={3} mt={4}>
              <Button colorScheme="blue" size="lg" onClick={() => navigate("/signup")}>
                Try Signing Up Again
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            </VStack>
          </VStack>
        );
      default:
        return null;
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
        {renderContent()}
      </Box>
    </Box>
  );
};

export default VerifyEmail;
