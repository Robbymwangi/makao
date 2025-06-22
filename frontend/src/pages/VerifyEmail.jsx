import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Heading, Spinner } from "@chakra-ui/react";
import { useSearchParams } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash || !type) {
          setStatus('error');
          setMessage('Invalid verification link. Missing required parameters.');
          return;
        }

        console.log('Verifying email with backend...');

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token_hash: tokenHash,
            type: type
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        console.log('Email verified successfully');
        setStatus('success');
        setMessage('Your email has been verified successfully! You can now close this window and log in to your account.');

      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <VStack spacing={6} textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Heading size="lg">Verifying your email...</Heading>
            <Text color="gray.600">
              Please wait while we confirm your email address.
            </Text>
          </VStack>
        );

      case 'success':
        return (
          <VStack spacing={6} textAlign="center">
            <CheckCircle size={64} color="#48BB78" />
            <Heading size="lg" color="green.600">
              Email Verified Successfully!
            </Heading>
            <Text color="gray.600" maxW="md">
              {message}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={4}>
              You may now close this window.
            </Text>
          </VStack>
        );

      case 'error':
        return (
          <VStack spacing={6} textAlign="center">
            <XCircle size={64} color="#F56565" />
            <Heading size="lg" color="red.600">
              Verification Failed
            </Heading>
            <Text color="gray.600" maxW="md">
              {message}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={4}>
              Please try signing up again or contact support if the problem persists.
            </Text>
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