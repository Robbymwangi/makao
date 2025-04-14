import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const AuthLayout = ({ children, image, vertical = false, leftContent }) => {
  if (vertical) {
    // Vertical layout: image on top, form on bottom.
    return (
      <Flex height="100vh" direction="column" position="relative">
        <Box
          flex="1"
          bgImage={`url(${image})`}
          bgSize="cover"
          bgPos="center"
          p={12}
          position="relative"
        >
          {leftContent && (
            <Text
              position="absolute"
              top="40px" // Move text to the very top
              left="40px"
              color="white"
              fontSize="5xl" // Set font size to 5xl
              fontWeight="bold"
              fontFamily="'Playfair Display', serif"
              textShadow="0px 2px 4px rgba(0, 0, 0, 0.6)"
            >
              {leftContent}
            </Text>
          )}
        </Box>
        <Box
          flex="1"
          p={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          {/* AuthHeader positioned at the top of the section */}
          
          {children}
        </Box>
      </Flex>
    );
  } else {
    // Default horizontal layout: image on left (hidden on mobile) and form on right.
    return (
      <Flex height="100vh" direction="row" position="relative">
        <Box
          flex="1"
          bgImage={`url(${image})`}
          bgSize="cover"
          bgPos="center"
          display={{ base: "none", md: "block" }}
          position="relative"
        >
          {leftContent && (
            <Text
              position="absolute"
              top="40px" // Move text to the very top
              left="40px"
              color="white"
              fontSize="6xl" 
              fontWeight="italic"
              fontFamily="'Playfair Display', serif"

            >
              {leftContent}
            </Text>
          )}
        </Box>
        <Box
          flex="1"
          p={12}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          
          {children}
        </Box>
      </Flex>
    );
  }
};

export default AuthLayout;