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
import PageTransition from "@/usercomponents/PageTransition/pagetransition";

const OTPChallengeSend = () => {
  const navigate = useNavigate();
  const [otpMethod, setOtpMethod] = useState("email");

  const handleSendOTP = () => {
    const otpPromise = new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000); // Simulated API delay
    });

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

    otpPromise.then(() => {
      setTimeout(() => {
        navigate("/otp-challengeresp", { state: { otpMethod } });
      }, 2500); // Delay navigation to allow the success toast to display
    });
  };

  const Card = ({ method, label, icon: Icon }) => {
    const isSelected = otpMethod === method;
    return (
      <HStack
        p={4}
        w="full"
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        borderColor={isSelected ? "gray.600" : "gray.300"}
        boxShadow={isSelected ? "0px 6px 12px rgba(0, 0, 0, 0.2)" : "0px 2px 4px rgba(0, 0, 0, 0.1)"}
        cursor="pointer"
        transition="all 0.25s ease-in-out"
        transform={isSelected ? "scale(1.03)" : "scale(1)"}
        _hover={{
          borderColor: "gray.600",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
        }}
        onClick={() => setOtpMethod(method)}
      >
        <Box boxSize="24px">
          <Icon size={24} strokeWidth={2} stroke="#333" fill="none" />
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
        <PageTransition>
          <VStack
            spacing={6}
            bg="white"
            p={{ base: 4, md: 8 }}
            borderRadius="lg"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
            w="full"
            maxW="400px"
            borderWidth="1px"
            borderColor="gray.300"
          >
            <Text fontSize="2xl" fontWeight="bold">
              Send OTP
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
              Select a device to receive your One-Time Password.
            </Text>
            <VStack w="full" spacing={4}>
              <Card method="email" label="e***@example.com" icon={Mail} />
              <Card method="phone" label="+123-xxx-xxxx" icon={Phone} />
            </VStack>
            <Button colorScheme="blackAlpha" w="full" onClick={handleSendOTP}>
              Send OTP
            </Button>
            <Button variant="outline" w="full" onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </VStack>
        </PageTransition>
      </Flex>
    </Flex>
  );
};

export default OTPChallengeSend;