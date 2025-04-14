import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import AuthHeader from "@/usercomponents/Auth/AuthHeader";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Mail, Phone } from "lucide-react";

const OTPChallengeSend = () => {
  const navigate = useNavigate();
  const [otpMethod, setOtpMethod] = useState("email");

  // Card styling
  const cardBg = "white";
  const selectedBorder = "gray.600";
  const defaultBorder = "gray.300";
  const selectedBoxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)";
  const defaultBoxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";

  const handleSendOTP = () => {
    // Create a mock promise to simulate OTP sending
    const otpPromise = new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful OTP sending
        resolve(true);
      }, 2000); // Simulated API delay
    });

    // Use promise-based toast
    toaster.promise(otpPromise, {
      loading: {
        title: "Sending OTP",
        description: "Please wait while we send your verification code",
      },
      success: {
        title: "OTP Sent!",
        description: `Code sent to ${
          otpMethod === "email" ? "e***@example.com" : "+123-xxx-xxxx"
        }`,
      },
      error: {
        title: "Failed to Send",
        description: "Please try again or contact support",
      },
    });

    // Navigate to the OTP response page after the promise resolves
    otpPromise.then(() => {
      setTimeout(() => {
        navigate("/otp-challengeresp", { state: { otpMethod } });
      }, 2500); // Delay navigation to allow the success toast to display
    });
  };

  
  // OTP card component
  const Card = ({ method, label, icon: Icon }) => {
    const isSelected = otpMethod === method;
    return (
      <HStack
        p={4}
        w="full"
        borderWidth="1px"
        borderRadius="md"
        bg={cardBg}
        borderColor={isSelected ? selectedBorder : defaultBorder}
        boxShadow={isSelected ? selectedBoxShadow : defaultBoxShadow}
        cursor="pointer"
        transition="all 0.25s ease-in-out"
        transform={isSelected ? "scale(1.03)" : "scale(1)"}
        _hover={{
          borderColor: selectedBorder,
          boxShadow: selectedBoxShadow,
        }}
        onClick={() => setOtpMethod(method)}
      >
        <Box boxSize="24px">
          <Icon
            size={24}
            strokeWidth={2}
            stroke="#333"
            fill="none"
          />
        </Box>
        <VStack spacing={0} align="start">
          <Text fontSize="lg" fontWeight="bold">
            {method === "email" ? "Email" : "Phone"}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {label}
          </Text>
        </VStack>
      </HStack>
    );
  };

  return (
    <Flex direction="column" minH="100vh" bg="gray.50" p={6}>
      <Toaster />
      <Box mb={6}>
        <AuthHeader />
      </Box>
      <Flex flex="1" align="center" justify="center">
        <VStack
          spacing={6}
          bg={cardBg}
          p={{ base: 4, md: 8 }}
          borderRadius="lg"
          boxShadow={defaultBoxShadow}
          w="full"
          maxW="400px"
          borderWidth="1px"
          borderColor={defaultBorder}
        >
          <Text fontSize="2xl" fontWeight="bold">
            Send OTP
          </Text>
          <Text fontSize="md" color="gray.600" textAlign="center">
            Select a device to receive your One-Time Password.
          </Text>
          
          {/* Selection cards */}
          <VStack w="full" spacing={4}>
            <Card method="email" label="e***@example.com" icon={Mail} />
            <Card method="phone" label="+123-xxx-xxxx" icon={Phone} />
          </VStack>

          <Button 
            colorScheme="blackAlpha" 
            w="full" 
            onClick={handleSendOTP}
          >
            Send OTP
          </Button>
          
          <Button 
            variant="outline" 
            w="full" 
            onClick={() => navigate("/login")}
          >
            Return to Login
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default OTPChallengeSend;