import React from "react";
import { Box, Heading, Input, Button, Flex } from "@chakra-ui/react";

const NewsletterSubscription = () => {
  return (
    <Box maxW="600px" mx="auto" py={15} px={4} textAlign="center" paddingTop={20}>
      <Heading
        fontFamily="'Playfair Display', serif"
        fontSize={{ base: "xl", md: "2xl" }}
        mb={4}
        fontWeight="normal"
      >
        Subscribe to our newsletter to stay informed on all the new trends, deals and events
      </Heading>

      <Flex as="form" w="100%" maxW="500px" mx="auto" align="center">
        <Input
          placeholder="Enter your email here"
          flex="1"
          bg="gray.100"
          border="none"
          px={4}
          py={3}
          _focus={{ outline: "none" }}
          fontSize={{ base: "sm", md: "md" }}
        />
        <Button
          bg="black"
          color="white"
          px={6}
          py={3}
          fontSize={{ base: "sm", md: "md" }}
          _hover={{ bg: "gray.800" }}
        >
          Subscribe
        </Button>
      </Flex>
    </Box>
  );
};

export default NewsletterSubscription;
