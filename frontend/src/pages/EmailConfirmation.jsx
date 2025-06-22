import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Button, Heading, Spinner } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { toaster } from "@/components/ui/toaster";
import { createClient } from '@supabase/supabase-js';

const EmailConfirmation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [resendLoading, setResendLoading] = useState(false);
  const [supabase, setSupabase] = useState(null);

  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  // Initialize Supabase client
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('Environment variables check:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
      urlValue: supabaseUrl,
      keyValue: supabaseAnonKey ? 'Present' : 'Missing'
    });

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabase(client);
        console.log('Supabase client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        setStatus('error');
        setSearchParams({ error: 'configuration_error' });
      }
    } else {
      console.error('Missing Supabase environment variables');
      setStatus('error');
      setSearchParams({ error: 'configuration_error' });
    }
  }, [setSearchParams]);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check if Supabase client is available
      if (!supabase) {
        console.log('Waiting for Supabase client initialization...');
        return;
      }

      // If we have success/error params from backend redirect, use those
      if (success === 'true') {
        setStatus('success');
        return;
      } else if (error) {
        setStatus('error');
        return;
      }

      // If we have token_hash and type, verify directly with Supabase
      if (tokenHash && type === 'signup') {
        try {
          console.log('Verifying email with token...');
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'signup'
          });

          if (verifyError) {
            console.error('Email verification error:', verifyError);
            setStatus('error');
            setSearchParams({ error: 'verification_failed' });
            return;
          }

          if (data.user) {
            console.log('Email verified successfully:', data.user.id);
            setStatus('success');
            setSearchParams({ success: 'true' });
            
            toaster.create({
              title: "Email Confirmed",
              description: "Your email has been verified successfully!",
              type: "success",
              duration: 5000,
            });
          } else {
            setStatus('error');
            setSearchParams({ error: 'verification_failed' });
          }
        } catch (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setSearchParams({ error: 'server_error' });
        }
      } else {
        // No verification params, show pending state
        setStatus('pending');
      }
    };

    handleEmailConfirmation();
  }, [supabase, tokenHash, type, success, error, setSearchParams]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'invalid_link':
        return 'The confirmation link is invalid or malformed.';
      case 'expired_link':
        return 'The confirmation link has expired. Please request a new one.';
      case 'verification_failed':
        return 'Email verification failed. The link may be invalid or expired.';
      case 'confirmation_failed':
        return 'Email confirmation failed. Please try again.';
      case 'server_error':
        return 'A server error occurred. Please try again later.';
      case 'configuration_error':
        return 'Application configuration error. Please contact support.';
      default:
        return 'An unknown error occurred during email confirmation.';
    }
  };

  const handleResendConfirmation = async () => {
    const email = localStorage.getItem('pendingConfirmationEmail');
    
    if (!email) {
      toaster.create({
        title: "Email Required",
        description: "Please go back to signup and try again.",
        type: "error",
        duration: 4000,
      });
      return;
    }

    setResendLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/auth/resend-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend confirmation email');
      }

      toaster.create({
        title: "Email Sent",
        description: "A new confirmation email has been sent to your inbox.",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to Resend",
        description: error.message || "Failed to resend confirmation email. Please try again.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <VStack spacing={6} textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Heading size="lg">Confirming your email...</Heading>
            <Text color="gray.600">
              Please wait while we verify your email address.
            </Text>
          </VStack>
        );

      case 'success':
        return (
          <VStack spacing={6} textAlign="center">
            <CheckCircle size={64} color="#48BB78" />
            <Heading size="lg" color="green.600">
              Email Confirmed Successfully!
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
        );

      case 'error':
        return (
          <VStack spacing={6} textAlign="center">
            <XCircle size={64} color="#F56565" />
            <Heading size="lg" color="red.600">
              Confirmation Failed
            </Heading>
            <Text color="gray.600">
              {getErrorMessage(error)}
            </Text>
            <VStack spacing={3} w="100%">
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleResendConfirmation}
                loading={resendLoading}
                disabled={resendLoading}
                leftIcon={<RefreshCw size={20} />}
              >
                {resendLoading ? "Sending..." : "Resend Confirmation Email"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Back to Sign Up
              </Button>
            </VStack>
          </VStack>
        );

      case 'pending':
      default:
        return (
          <VStack spacing={6} textAlign="center">
            <Mail size={64} color="#4299E1" />
            <Heading size="lg">Check Your Email</Heading>
            <Text color="gray.600">
              We've sent a confirmation link to your email address. 
              Please click the link to verify your account.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Didn't receive the email? Check your spam folder or click below to resend.
            </Text>
            <VStack spacing={3} w="100%">
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleResendConfirmation}
                loading={resendLoading}
                disabled={resendLoading}
                leftIcon={<RefreshCw size={20} />}
              >
                {resendLoading ? "Sending..." : "Resend Confirmation Email"}
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
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4}>
      <VStack spacing={8} maxW="md" mx="auto">
        <AuthHeader />
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="md"
          w="100%"
          borderWidth="1px"
          borderColor="gray.200"
        >
          {renderContent()}
        </Box>
      </VStack>
    </Box>
  );
};

export default EmailConfirmation;