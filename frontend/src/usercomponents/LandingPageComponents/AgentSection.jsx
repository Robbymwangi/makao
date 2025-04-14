import React from "react";
import { 
  Box, 
  Button, 
  Flex, 
  Grid, 
  Image, 
  Text, 
  useBreakpointValue 
} from "@chakra-ui/react";

const AgentSection = () => {
  const isSmallScreen = useBreakpointValue({ base: true, md: true, lg: false });

  if (isSmallScreen) {
    return (
      <Flex direction="column" align="center" p={4} maxW="container.lg" mx="auto">
        {/* Text and Button Row */}
        <Flex
          w="100%"
          justify="center"
          align="center"
          mb={6}  
          direction="column"
          textAlign="center"
          p={6} 
        >
          <Text fontSize="xl" fontFamily="'Playfair Display', serif">
            Best part - You have an agent at your fingertips, ready to help you whenever - from curation to aftersales.
          </Text>
          <Button
            mt={4}
            bg="black"
            color="white"
            _hover={{ bg: "gray.700" }}
            fontWeight="bold"
          >
            View our partners and experts
          </Button>
        </Flex>

        {/* Images arranged in one row (3 columns) */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%" justifyContent="center">
          <Image
            src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
            alt="Agent 1"
            objectFit="cover"
            w="100%"
            h="400px"
            borderRadius={"sm"}
          />
          <Image
            src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
            alt="Agent 2"
            objectFit="cover"
            w="100%"
            h="400px"
            borderRadius={"sm"}
          />
          <Image
            src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
            alt="Agent 3"
            objectFit="cover"
            w="100%"
            h="400px"
            borderRadius={"sm"}
          />
        </Grid>

        {/* Bottom Text */}
        <Box mt={6} p={6} textAlign="center">
          <Text fontSize="xl" fontFamily="'Playfair Display', serif">
            With over 4 years of experience, our entire team of real estate experts are the very best at what they do.*
          </Text>
        </Box>
      </Flex>
    );
  }

  // Large screen layout 
  return (
    <Flex direction="column" align="center" p={7} maxW="container.lg" mx="auto">
      {/* Top Section: Text Left, Image Right */}
      <Grid templateColumns={{ base: "1fr", md: "1.2fr 1.8fr" }} gap={6} alignItems="center" w="100%" mb={0}>
        {/* Left Text */}
        <Box p={6}> 
          <Text fontSize="2xl" fontFamily="'Playfair Display', serif">
            Best part - You have an agent at your fingertips, ready to help you whenever - from curation to aftersales.
          </Text>
          <Button mt={4} bg="black" color="white" _hover={{ bg: "gray.700" }} fontWeight="bold">
            View our partners and experts
          </Button>
        </Box>

        {/* Right Image */}
        <Box>
          <Image
            src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
            alt="Agents"
            objectFit="cover"
            w="100%"
            h={{ base: "400px", md: "500px" }}
          />
        </Box>
      </Grid>

      {/* Bottom Section: Two Images Side by Side, Text on the Right */}
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} w="100%" mt={0}>
        {/* Left: Two Images Side by Side */}
        <Box>
          <Flex gap={4}>
            <Box flex="1">
              <Image
                src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
                alt="Agent Discussion"
                objectFit="cover"
                w="100%"
                h={{ base: "200px", md: "250px" }}
                borderRadius="md"
              />
            </Box>
            <Box flex="1">
              <Image
                src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
                alt="Meeting"
                objectFit="cover"
                w="100%"
                h={{ base: "200px", md: "250px" }}
                borderRadius="md"
              />
            </Box>
          </Flex>
        </Box>

        {/* Right: Text Block */}
        <Box p={6}> 
          <Text fontSize="2xl" fontFamily="'Playfair Display', serif" mt={{ base: 4, md: 8 }}>
            With over 4 years of experience, our entire team of real estate experts are the very best at what they do.*
          </Text>
        </Box>
      </Grid>
    </Flex>
  );
};

export default AgentSection;