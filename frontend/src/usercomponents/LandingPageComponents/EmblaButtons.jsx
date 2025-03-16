// EmblaButtons.js
import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EmblaButtons = ({ emblaApi }) => {
  if (!emblaApi) return null;

  return (
    <>
      <IconButton 
        aria-label="Previous slide" 
        icon={<ChevronLeft />} 
        position="absolute" 
        left={{ base: 2, md: 4 }} 
        top="50%" 
        transform="translateY(-50%)"
        onClick={() => emblaApi.scrollPrev()} 
        borderRadius="full"
      />
      <IconButton 
        aria-label="Next slide" 
        icon={<ChevronRight />} 
        position="absolute" 
        right={{ base: 2, md: 4 }} 
        top="50%" 
        transform="translateY(-50%)"
        onClick={() => emblaApi.scrollNext()} 
        borderRadius="full"
      />
    </>
  );
};

export default EmblaButtons;
