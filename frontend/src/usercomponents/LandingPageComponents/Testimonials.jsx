import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Grid, 
  GridItem, 
  Button, 
  Avatar as ChakraAvatar 
} from '@chakra-ui/react';

const testimonials = [
  {
    name: "Sarah",
    location: "New York, NY",
    image: "/assets/Images/sarah.jpg",
    feedback: "Makao made finding my new home stress-free and enjoyable. Their personalized service and attention to detail are unmatched!",
  },
  {
    name: "Michael",
    location: "Los Angeles, CA",
    image: "/assets/Images/michael.jpg",
    feedback: "I found a beautiful and affordable home thanks to Makao. The process was smooth and the team was incredibly supportive.",
  },
  {
    name: "David",
    location: "Chicago, IL",
    image: "/assets/Images/david.jpg",
    feedback: "Makao's platform is intuitive and user-friendly. I quickly found several listings that matched my criteria and ultimately chose the perfect one.",
  },
  {
    name: "Emily",
    location: "Austin, TX",
    image: "/assets/Images/emily.jpg",
    feedback: "The personalized assistance I received from Makao was fantastic. They really understood my needs and helped me find a home within my budget.",
  },
  {
    name: "Linda",
    location: "Miami, FL",
    image: "/assets/Images/linda.jpg",
    feedback: "I highly recommend Makao to anyone looking for a new home. Their service is exceptional, and their team is dedicated to helping you find the right place.",
  },
  {
    name: "Sophia",
    location: "Seattle, WA",
    image: "/assets/Images/sophia.jpg",
    feedback: "Makao's after-sales support was a game-changer for me. They helped me settle into my new home with ease and comfort.",
  },
];

const Testimonials = () => {
  return (
    <Box py={12} px={6} maxW="7xl" mx="auto" textAlign="center">
      {/* Title */}
      <Heading fontSize="3xl" mb={2} fontFamily="'Playfair Display', serif">
        What Our Customers Are Saying
      </Heading>
      <Text fontSize="lg" color="gray.600" mb={8} fontFamily="'Playfair Display', serif">
        Hear from our satisfied clients who found their dream homes with Makao.
      </Text>

      {/* Testimonials Grid */}
      <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} 
        gap={6} 
        mb={8}
      >
        {testimonials.map((testimonial, index) => (
          <GridItem
            key={index}
            bg="gray.100"
            p={6}
            borderRadius="md"
            textAlign="left"
            transition="transform 0.3s ease, opacity 0.3s ease"
          >
            <ChakraAvatar.Root size="lg" mb={3}>
              <ChakraAvatar.Fallback name={testimonial.name} />
              <ChakraAvatar.Image src={testimonial.image} />
            </ChakraAvatar.Root>
            <Heading fontSize="lg">{testimonial.name}</Heading>
            <Text fontSize="sm" color="gray.500" mb={3}>
              {testimonial.location}
            </Text>
            <Text fontSize="md" color="gray.700">
              "{testimonial.feedback}"
            </Text>
          </GridItem>
        ))}
      </Grid>

      {/* CTA Button */}
      <Button 
        bg="black" 
        color="white" 
        size="lg"
        _hover={{ bg: 'gray.800' }}
      >
        Share your experience
      </Button>
    </Box>
  );
};

export default Testimonials;
