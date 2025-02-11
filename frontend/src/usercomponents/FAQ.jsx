import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from '@/components/ui/accordion'; // Adjust the path as needed

const FAQ = () => {
  return (
    <Box maxW="1100px" mx="auto" my={12} p={6}>
      <Heading
        mb={8}
        fontFamily="'Playfair Display', serif"
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="bold"
        textAlign="center"
      >
        Frequently Asked Questions
      </Heading>
      <Box
        mb={10}
        fontFamily="'Playfair Display', serif"
        fontSize={{ base: "lg", md: "xl" }}
        color="gray.600"
        textAlign="center"
      >
        Find answers to common questions about buying homes with Makao.
      </Box>

      <AccordionRoot multiple defaultValue={["item1"]}>
        <Box mb={4}>
          <AccordionItem value="item1">
            <AccordionItemTrigger 
              fontFamily="'Playfair Display', serif" 
              fontWeight="bold" 
              fontSize={{ base: "lg", md: "xl" }}
            >
              How do I search for a property?
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Text
                fontFamily="'Playfair Display', serif"
                fontSize={{ base: "md", md: "lg" }}
              >
                You can search for a property by using our online listings. Simply filter by location, price, and features that matter to you.
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        </Box>

        <Box mb={4}>
          <AccordionItem value="item2">
            <AccordionItemTrigger 
              fontFamily="'Playfair Display', serif" 
              fontWeight="bold" 
              fontSize={{ base: "lg", md: "xl" }}
            >
              What are the costs involved in buying a home?
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Text
                fontFamily="'Playfair Display', serif"
                fontSize={{ base: "md", md: "lg" }}
              >
                Costs include the down payment, mortgage, closing costs, property taxes, home insurance, and ongoing maintenance expenses.
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        </Box>

        <Box mb={4}>
          <AccordionItem value="item3">
            <AccordionItemTrigger 
              fontFamily="'Playfair Display', serif" 
              fontWeight="bold" 
              fontSize={{ base: "lg", md: "xl" }}
            >
              How can I schedule a viewing?
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Text
                fontFamily="'Playfair Display', serif"
                fontSize={{ base: "md", md: "lg" }}
              >
                You can schedule a viewing by contacting the listing agent or using our online booking feature on our platform.
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        </Box>

        <Box mb={4}>
          <AccordionItem value="item4">
            <AccordionItemTrigger 
              fontFamily="'Playfair Display', serif" 
              fontWeight="bold" 
              fontSize={{ base: "lg", md: "xl" }}
            >
              What should I look for during a home inspection?
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Text
                fontFamily="'Playfair Display', serif"
                fontSize={{ base: "md", md: "lg" }}
              >
                Focus on the foundation, roofing, plumbing, electrical systems, and any potential structural issues. Our detailed checklist can guide you through the process.
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        </Box>

        <Box mb={4}>
          <AccordionItem value="item5">
            <AccordionItemTrigger 
              fontFamily="'Playfair Display', serif" 
              fontWeight="bold" 
              fontSize={{ base: "lg", md: "xl" }}
            >
              How do I make an offer on a property?
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Text
                fontFamily="'Playfair Display', serif"
                fontSize={{ base: "md", md: "lg" }}
              >
                Work with a real estate agent who will help you draft a competitive offer and negotiate with the seller.
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        </Box>
      </AccordionRoot>
    </Box>
  );
};

export default FAQ;
