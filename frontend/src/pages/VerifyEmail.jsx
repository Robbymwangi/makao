import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Heading, Spinner, Button } from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get all URL parameters
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const redirectType = searchParams.get('redirect_type');

        console.log('All URL parameters:', {
          tokenHash,
          type,
          redirectType,
          allParams: Object.fromEntries(searchParams.entries())
        });

        // Check if we have the required parameters
        if (!tokenHash || !type) {
          console.log('Missing required parameters');
          setStatus('error');
          setMessage('Invalid verification link. Missing required parameters.');
          return;
        }

        console.log('Verifying email with token_hash:', tokenHash, 'type:', type);
        
        // Use verifyOtp to confirm the email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type
        });

        console.log('Verification response:', { data, error });

        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage(`Email verification failed: ${error.message}`);
          return;
        }

        if (data.user) {
          console.log('Email verified successfully for user:', data.user.id);
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now log in to your account.');
          
          // Show success toast
          toaster.create({
            title: "Email Verified",
            description: "Your email has been confirmed successfully!",
            type: "success",
            duration: 5000,
          });
        } else {
          console.log('No user data returned');
          setStatus('error');
          setMessage('Verification failed. No user data returned.');
        }

      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(`Email verification failed: ${error.message}`);
      }
    };

    // Only run verification if we have URL parameters
    if (searchParams.toString()) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification parameters found in URL.');
    }
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
            <Button
              colorScheme="green"
              size="lg"
              onClick={() => navigate('/login')}
              mt={4}
            >
              Continue to Login
            </Button>
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
            <VStack spacing={3} mt={4}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Try Signing Up Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
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