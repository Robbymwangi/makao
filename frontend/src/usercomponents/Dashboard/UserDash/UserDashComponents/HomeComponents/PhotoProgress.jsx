import React from "react";
import { Box, Text, HStack, Flex, Link, Image as ChakraImage } from "@chakra-ui/react";
import { Image as LucideImage, Plus, Download } from "lucide-react";

const PhotoProgress = ({ files }) => {
  if (!files || files.length === 0) {
    return <div>No photos found for this project.</div>;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="xl" boxShadow="sm" mt={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">Photo Progress</Text>
      </Flex>
      <HStack spacing={6} overflowX="auto" pb={2}>
        {files.map((file) => (
          <Box
            key={file.id}
            minW="240px"
            borderWidth="1px"
            borderRadius="xl"
            p={4}
            flexShrink={0}
            boxShadow="xl"
            bg="gray.50"
          >
            {/* Show the actual image */}
            <ChakraImage
              src={file.file_url}
              alt={file.file_name}
              h="160px"
              w="100%"
              objectFit="cover"
              borderRadius="md"
              mb={4}
              fallbackSrc="https://via.placeholder.com/240x160?text=No+Image"
            />
            <HStack spacing={2} justify="space-between">
              <HStack spacing={2}>
                <LucideImage size={16} />
                <Text fontSize="sm" isTruncated maxW="120px">{file.file_name}</Text>
              </HStack>
              {/* Download button */}
              <Link href={file.file_url} download target="_blank" rel="noopener noreferrer">
                <Download size={18} />
              </Link>
            </HStack>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default PhotoProgress;