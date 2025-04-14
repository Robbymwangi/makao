import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";


const MotionBox = motion(Box);

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      px={16}
    >
      <VStack spacing={16} textAlign="center" maxW="lg">
        <Text
          fontSize="5xl"
          fontWeight="bold"
          fontFamily="'Playfair Display', serif"
        >
          Makao
        </Text>
        <Heading fontSize="4xl" color="gray.800">
          404 – Page Not Found
        </Heading>
        <Text fontSize="md" color="gray.600" px={10}>
          Oops! The page you’re looking for doesn’t exist. It might have been moved or deleted.
        </Text>
        <Button
          mt={8}
          onClick={() => navigate("/login")}
          bg="black"
          color="white"
          px={6}
          py={15}
          fontSize="md"
          _hover={{ bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
        >
          Back to Login
        </Button>
       
      </VStack>
    </MotionBox>
  );
};

export default NotFound;
