import React from "react";
import { Box, Flex, Text, Link, Stack, useBreakpointValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";

const Footer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="white" color="black" py={10} px={6} borderTop="1px solid #ddd" mt={40}>
      <Flex 
        direction={isMobile ? "column" : "row"} 
        justify={isMobile ? "center" : "space-between"} 
        align={isMobile ? "center" : "flex-start"} 
        maxW="1100px" 
        mx="auto"
      >
        {/* Logo moves to the top on mobile */}
        <Box mb={isMobile ? 6 : 0} textAlign={isMobile ? "center" : "left"}>
          <Text fontSize="xl" fontWeight="bold" fontFamily="'Playfair Display', serif">
            Makao
          </Text>
        </Box>

        {/* Links Section */}
        <Flex gap={10} wrap="wrap" justify={isMobile ? "center" : "flex-start"}>
          <Stack spacing={2} textAlign={isMobile ? "center" : "left"}>
            <Text fontWeight="bold">Connect</Text>
            <Link href="#">Instagram</Link>
            <Link href="#">Facebook</Link>
            <Link href="#">Pinterest</Link>
            <Link href="#">YouTube</Link>
          </Stack>
          <Stack spacing={2} textAlign={isMobile ? "center" : "left"}>
            <Text fontWeight="bold">Resources</Text>
            <Link href="#">FAQs</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="/staff/login">Talent Login</Link>
          </Stack>
          <Stack spacing={2} textAlign={isMobile ? "center" : "left"}>
            <Text fontWeight="bold">About</Text>
            <Link href="#">Our Story</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Press</Link>
          </Stack>
        </Flex>
      </Flex>

      {/* Copyright */}
      <Text mt={15} textAlign="center" fontSize="sm" color="gray.500">
        All rights reserved. All trademarks, logos, and brand names are the property of their respective owners. <br />
        Makao LLC © {currentYear}
        {" | "}
      </Text>
    </Box>
  );
};

export default Footer;
