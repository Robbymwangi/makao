import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";


// Create a MotionBox component from Chakra UI's Box
const MotionBox = motion.create(Box);

// Define a simple blinking animation for the cursor
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

// AnimatedText Component: types and then deletes text from an array of words.
const AnimatedText = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 50,
  pauseDuration = 1500,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer;

    // If not deleting, add one character at a time
    if (!isDeleting && displayText !== currentWord) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
      }, typingSpeed);
    } 
    // If deleting, remove one character at a time
    else if (isDeleting && displayText !== "") {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
      }, deletingSpeed);
    } 
    // When the full word is displayed, pause and then start deleting
    else if (!isDeleting && displayText === currentWord) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } 
    // After deletion, move to the next word in the array
    else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [
    displayText,
    isDeleting,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span>
      {displayText}
      <Box as="span" ml="1" animation={`${blink} 1s linear infinite`}>
        |
      </Box>
    </span>
  );
};

const HeroSection = () => {
  return (
    <Container maxW="7xl" pt={"60px"} pb={12} fontFamily="Playfair Display, serif">
      <Flex
        direction={{ base: "column", lg: "row" }}
        align={{ base: "center", lg: "stretch" }}
        textAlign={{ base: "center", lg: "left" }}
        gap={{ base: 10, lg: 20 }}
      >
        {/* Left Side: Hero Text and Collage Overlay */}
        <Box
          flex={{ lg: 1.2 }}
          maxW={{ lg: "60%" }}
          position="relative"
          w={{ base: "100%", lg: "auto" }}
        >
          {/* Collage Overlay (only visible on small/medium screens) */}
          <MotionBox
            display={{ base: "block", lg: "none" }}
            position="absolute"
            top="-50px"
            left="-10px"
            right="-10px"
            bottom="-65px"
            zIndex={-1}
            overflow="hidden"
            // Animate in: fade from opacity 0 & slide from above to opacity 0.4 at y=0
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          >
          
            {/* Collage Image 1: Top-Left */}
            <Image
              src="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
              position="absolute"
              top="-5px"
              left="-30px"
              boxSize="140px"
              height="250px"
              borderRadius="md"
              objectFit="cover"
              transform="rotate(0deg)"
            />

            {/* Collage Image 2: Top-Right */}
            <Image
              src="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
              position="absolute"
              top="150px"
              right="-20px"
              boxSize="220px"
              height="350px"
              borderRadius="md"
              objectFit="cover"
              transform="rotate(-15deg)"
            />

            {/* Collage Image 3: Top-Center */}
            <Image
              src="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
              position="absolute"
              top="-8px"
              left="35%"
              boxSize="300px"
              height="120px"
              borderRadius="md"
              objectFit="cover"
              transform="rotate(-4deg)"
            />

            {/* Collage Image 4: Bottom-Left */}
            <Image
              src="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
              position="absolute"
              bottom="30px"
              left="0"
              boxSize="120px"
              height="160px"
              borderRadius="md"
              objectFit="cover"
              transform="rotate(-5deg)"
              scale="2.0"
            />

            {/* Collage Image 5: Bottom-Center */}
            <Image
              src="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
              position="absolute"
              bottom="0"
              left="60%"
              height="130px"
              width="150px"
              borderRadius="md"
              objectFit="cover"
              transform="rotate(4deg)"
              scale="1.5"
            />
          </MotionBox>

          {/* Hero Text Content */}
          <VStack
            spacing={{ base: 6, lg: 8 }}
            align={{ base: "center", lg: "flex-start" }}
            justify={{ base: "center", lg: "center" }}
            minH={{ base: "85vh", lg: "90vh" }}
            zIndex={1}
            px={{ base: 4, lg: 0 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "7xl", md: "7xl", lg: "7xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              maxW={{ base: "90%", lg: "80%" }}
              fontFamily="Playfair Display"
            >
              It's more than a home.
            </Heading>

            <Heading
              as="h2"
              fontSize={{ base: "7xl", md: "7xl", lg: "7xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              fontFamily="Playfair Display"
            >
              It's a{" "}
              <Text as="span" color="#807906">
                <AnimatedText
                  words={["Lifestyle", "Utopia", "Retreat", "Paradise"]}
                />
              </Text>
            </Heading>

            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              maxW={{ base: "90%", lg: "70%" }}
            >
              Welcome to Makao, an experience where we will help curate, build and manage the home of your dreams, anywhere and anytime.
            </Text>

            <Button colorScheme="blackAlpha" size="lg"  mt={4}>
              Click to start your journey
            </Button>
          </VStack>
        </Box>

        {/* Right Side: Large Screen Image (displayed only on large screens) */}
        <Box
          flex={{ lg: 1.2 }}
          maxW={{ lg: "70%" }}
          display={{ base: "none", lg: "block" }}
          position="relative"
          overflow="hidden"
          borderRadius="lg"
        >
          <Image
            src="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
            alt="People enjoying their home"
            objectFit="cover"
            objectPosition="center"
            w="100%"
            h="100%"
            minH="500px"
            loading="eager"
            transform="scale(1.05)"
          />
        </Box>
      </Flex>
    </Container>
  );
};

export default HeroSection;
