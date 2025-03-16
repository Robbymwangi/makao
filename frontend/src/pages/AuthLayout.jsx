import React from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";

const AuthLayout = ({ children, image, vertical = false, leftContent }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (vertical) {
    // Vertical layout: image on top, form on bottom.
    return (
      <Flex height="100vh" direction="column">
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
              bottom="20px"
              left="20px"
              color="white"
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="bold"
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
          justifyContent="center" 
          alignItems="center"
        >
          {children}
        </Box>
      </Flex>
    );
  } else {
    // Default horizontal layout: image on left (hidden on mobile) and form on right.
    return (
      <Flex height="100vh" direction="row">
        <Box 
          flex="1" 
          bgImage={`url(${image})`} 
          bgSize="cover" 
          bgPos="center" 
          p={12} 
          display={{ base: "none", md: "block" }} 
          position="relative"
        >
          {leftContent && (
            <Text 
              position="absolute"
              bottom="20px"
              left="20px"
              color="white"
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="bold"
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
          pt={{ base: 8, md: 20 }}
        >
          {children}
        </Box>
      </Flex>
    );
  }
};

export default AuthLayout;
