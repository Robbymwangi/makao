import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Box, Heading, Image, Flex } from '@chakra-ui/react';


const companies = [
  { id: 1, name: "Company One", image: "/assets/Images/pexels-anastasia-shuraeva-7647212.jpg" },
  { id: 2, name: "Company Two", image: "/assets/Images/pexels-anastasia-shuraeva-7647212.jpg" },
  { id: 3, name: "Company Three", image: "/assets/Images/pexels-anastasia-shuraeva-7647212.jpg" },
  { id: 4, name: "Company Four", image: "/assets/Images/pexels-anastasia-shuraeva-7647212.jpg" },
  { id: 5, name: "Company Five", image: "/assets/Images/pexels-anastasia-shuraeva-7647212.jpg" },
  { id: 6, name: "Company Six", image: "/assets/Images/pexels-anastasia-shuraeva-7647212.jpg" },
];

const ClientShowcase = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: false,
    duration: 7000,
    spacing: 32
  });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 1);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <Box py={25} position="relative" overflow="hidden" paddingTop={20}>
      <Box maxW="7xl" mx="auto" px={4} textAlign="center" mb={12}>
        <Heading 
          fontSize={{ base: "2xl", md: "3xl" }} 
          mb={5} 
          fontFamily="'Playfair Display', serif"
        >
          Working With The Best - In Africa and Beyond
        </Heading>
      </Box>

      <Box ref={emblaRef} overflow="hidden" mx="auto" maxW="100%">
        <Flex 
          className="embla__container" 
          h="full"
          css={{
            backfaceVisibility: 'hidden',
            display: 'flex',
            touchAction: 'pan-y',
            marginLeft: '-16px'
          }}
        >
          {companies.map((company) => (
            <Flex
              key={company.id}
              className="embla__slide"
              flex="0 0 180px"
              minW="280px"
              ml="32px"
              align="center"
              justify="center"
              transition="filter 0.3s ease"
              filter="grayscale(100%)"
              _hover={{ filter: "grayscale(0%)" }}
            >
              <Image
                src={company.image}
                alt={company.name}
                objectFit="contain"
                width="full"
                height="80px"
                mx="auto"
                px={4}
              />
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ClientShowcase;