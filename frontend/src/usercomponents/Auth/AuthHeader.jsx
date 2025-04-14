
import React from "react";
import { HStack, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode"; 

const AuthHeader = () => {
  return (
    <HStack justifyContent="space-between" w="100%" mb={6}>
      <Text fontFamily="'Playfair Display', serif" fontSize="3xl" fontWeight="bold">
        Makao
      </Text>
      <ColorModeButton />
    </HStack>
  );
};

export default AuthHeader;
