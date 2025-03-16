import React from "react";
import { Box, Grid, GridItem, Image, Text, Heading, Badge } from "@chakra-ui/react";

const articles = [
  {
    id: 1,
    title: "Community Matters: The Benefits of Choosing the Right Neighborhood",
    author: "Mellissa Bail",
    imageUrl: "https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3",
  },
  {
    id: 2,
    title: "The Rise of Minimalist Living: Less Stuff, More Happiness",
    author: "Jesse Rowe",
    imageUrl: "https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3",
  },
];

const LatestArticles = () => {
  return (
    <Box maxW="1100px" mx="auto" py={6} px={6}>
      <Heading
        mb={8}
        fontFamily="'Playfair Display', serif"
        fontSize={{ base: "3xl", md: "4xl" }}
      >
        Read our latest Articles
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={14}>
        {articles.map((article) => (
          <GridItem key={article.id}>
            <Box position="relative">
              <Image
                src={article.imageUrl}
                alt={article.title}
                borderRadius="md"
                objectFit="cover"
                width="100%"
                height={{ base: "200px", md: "auto" }}
              />
              <Badge
                position="absolute"
                bottom="10px"
                left="10px"
                bg="white"
                color="black"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 3, md: 5 }}
                py={{ base: 1, md: 2 }}
                borderRadius="md"
                boxShadow="md"
              >
                Written by <strong>{article.author}</strong>
              </Badge>
            </Box>
            <Text
              mt={3}
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="'Playfair Display', serif"
            >
              {article.title}
            </Text>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default LatestArticles;
