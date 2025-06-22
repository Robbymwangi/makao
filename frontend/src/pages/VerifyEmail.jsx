import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Heading, Spinner } from "@chakra-ui/react";
import { useSearchParams } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";
import supabase from "@/utils/supabaseClient";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get all URL parameters
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        console.log('URL parameters:', { tokenHash, type, accessToken, refreshToken });

        // If we have access_token and refresh_token, the user is already verified
        if (accessToken && refreshToken) {
          console.log('User already verified with tokens');
          
          // Set the session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session error:', error);
            setStatus('error');
            setMessage('Failed to establish session after verification.');
            return;
          }

          console.log('Session established:', data);
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now close this window and log in to your account.');
          return;
        }

        // If we have token_hash and type, use verifyOtp
        if (tokenHash && type) {
          console.log('Verifying with token_hash and type');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type
          });

          if (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('Email verification failed. The link may be invalid or expired.');
            return;
          }

          if (data.user) {
            console.log('Email verified successfully:', data.user.id);
            setStatus('success');
            setMessage('Your email has been verified successfully! You can now close this window and log in to your account.');
          } else {
            setStatus('error');
            setMessage('Verification failed. Please try again.');
          }
          return;
        }

        // If no valid parameters found
        setStatus('error');
        setMessage('Invalid verification link. Missing required parameters.');

      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Email verification failed. Please try again or contact support.');
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