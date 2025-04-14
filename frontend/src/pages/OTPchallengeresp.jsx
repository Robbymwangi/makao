"use client";

import React from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Flex,
  PinInput,
  usePinInput,
} from "@chakra-ui/react";
import AuthHeader from "@/usercomponents/Auth/AuthHeader";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useNavigate, useLocation } from "react-router";

const OTPChallengeResp = () => {
  const store = usePinInput(); // Use Chakra's PinInput store
  const navigate = useNavigate();
  const location = useLocation();
  const otpMethod = location.state?.otpMethod || "email"; // Default to email if not provided

  const handleVerifyOTP = () => {
    const otp = store.value.join(""); // Combine the entered OTP values into a single string

    if (otp === "1234") {
      // If OTP is correct
      toaster.create({
        title: "OTP Verified",
        description: "Your identity has been successfully verified.",
        type: "success",
        duration: 5000,
      });
      setTimeout(() => {
        navigate("/dashboard"); // Navigate to the dashboard
      }, 1000);
    } else {
      // If OTP is incorrect
      toaster.create({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg="gray.50" p={6}>
      <Toaster />
      <Box mb={6}>
        <AuthHeader />
      </Box>
      <Flex flex="1" align="center" justify="center">
        <VStack
          spacing={10}
          bg="white"
          p={{ base: 4, md: 8 }}
          borderRadius="lg"
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
          w="full"
          maxW="400px"
          border="1px solid"
          borderColor="gray.300"
          transition="all 0.25s ease-in-out"
        >
          <Text fontSize="2xl" fontWeight="bold" textAlign={"center"} mt={4} paddingBottom={2}>
            Kindly enter your OTP
          </Text>

          <Text fontSize="md" textAlign={"center"} paddingBottom={2} color="gray.600">
            {otpMethod === "email"
              ? "An OTP has been sent to your registered email address."
              : "An OTP has been sent to your registered phone number."}
          </Text>

          {/* OTP Input */}
          <PinInput.RootProvider value={store}
           size={"2xl"}
           paddingBottom={4}>
            <PinInput.Control>
              <PinInput.Input index={0} />
              <PinInput.Input index={1} />
              <PinInput.Input index={2} />
              <PinInput.Input index={3} />
            </PinInput.Control>
          </PinInput.RootProvider>

          <Button
            bg="black"
            color="white"
            w="full"
            _hover={{ bg: "gray.700" }}
            _active={{ bg: "gray.800" }}
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </Button>
          <Button variant="outline" w="full" onClick={() => navigate("/login")}>
            Return to Login
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default OTPChallengeResp;