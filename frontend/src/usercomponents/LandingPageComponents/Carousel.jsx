import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  Image as ChakraImage // Renamed to avoid conflict if HTMLImageElement is inferred
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import './Carousel.css'; // Importing the updated CSS

// Adjusted TWEEN_FACTOR_BASE for a more spread-out tweening effect
const TWEEN_FACTOR_BASE = 0.15; // Adjusted for more items

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const CarouselSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'keepSnaps',
    dragFree: true,
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const carouselItems = [
    { id: 1, title: 'Meraki', subtitle: 'Cozy studio in a vibrant neighborhood.', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y296eSUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 2, title: 'Riverside Retreat', subtitle: 'Spacious family home with river views.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFtaWx5JTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 3, title: 'Urban Oasis', subtitle: 'Luxury apartment with city skyline views.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
    { id: 4, title: 'The Minimalist', subtitle: 'Chic and affordable city studio.', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1pbmltYWxpc3QlMjBhcGFydG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 5, title: 'Loft Living', subtitle: 'Open-concept industrial-chic space.', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9mdCUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 6, title: 'Suburban Charm', subtitle: 'Ideal for growing families, near parks.', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VidXJiYW4lMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 7, title: 'Downtown Penthouse', subtitle: 'Exclusive living with panoramic views.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bHV4dXJ5JTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
  ];

  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const setTweenNodes = useCallback((emblaApiInstance) => {
    if (!emblaApiInstance) return;
    tweenNodes.current = emblaApiInstance.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__tween');
    });
  }, []);

  const setTweenFactor = useCallback((emblaApiInstance) => {
    if (!emblaApiInstance) return;
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApiInstance.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApiInstance, eventName) => {
    if (!emblaApiInstance || !tweenNodes.current.length) return;
    const engine = emblaApiInstance.internalEngine();
    const scrollProgress = emblaApiInstance.scrollProgress();
    const slidesInView = emblaApiInstance.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApiInstance.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex) && !engine.options.loop) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }
        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        // Adjusted scale range for more pronounced effect with more slides
        const scale = numberWithinRange(tweenValue, 0.6, 1).toString(); 
        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          tweenNode.style.transform = `scale(${scale})`;
        }
      });
    });
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    const handleResize = () => {
      setTweenNodes(emblaApi); 
      setTweenFactor(emblaApi); 
      tweenScale(emblaApi); 
    };

    emblaApi
      .on('reInit', () => { 
        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);
        setSelectedIndex(emblaApi.selectedScrollSnap());
      })
      .on('scroll', tweenScale)
      .on('select', () => { 
        setSelectedIndex(emblaApi.selectedScrollSnap());
        tweenScale(emblaApi, 'select');
      });
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [emblaApi, tweenScale, setTweenNodes, setTweenFactor]);


  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    // Changed background to white, adjusted padding
    <Box py={{ base: 10, md: 20 }} position="relative" overflow="hidden" bg="white"> 
      <Box maxW="7xl" mx="auto" px={4} mb={{ base: 8, md: 12 }} textAlign="center">
        {/* Adjusted text color for white background */}
        <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4} fontFamily="'Playfair Display', serif" color="gray.800"> 
          We get it, Building your dream home can be a nightmare.
        </Heading>
        <Text fontSize={{ base: "lg", md: "xl" }} maxW="2xl" mx="auto" fontFamily="'Playfair Display', serif" color="gray.600">
          That is why at Makao, we make building your own home simple, stress-free, and tailored to your needs.
          And for those looking for inspiration, our team of experts will help you get exactly what you want, with no fuss.
        </Text>
      </Box>

      <Box className="embla" ref={emblaRef}>
        <Flex className="embla__container">
          {carouselItems.map((item, index) => (
            <Box
              key={item.id}
              className="embla__slide" 
              position="relative"
              flex={`0 0 ${isMobile ? '80%' : '300px'}`}
            >
              <Box
                className="embla__slide__tween" 
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  // Card background adjusted for contrast on white bg
                  bg="gray.100" 
                  h="var(--slide-height)" 
                  w="100%" 
                  borderRadius="xs" // Decreased corner radius
                  overflow="hidden"
                  position="relative"
                  boxShadow="4xl" // Enhanced shadow for depth on white bg
                >
                  <ChakraImage
                    className="embla__slide__img" 
                    src={item.image}
                    alt={item.title}
                    opacity={0.95} // Slightly less opacity
                    transition="opacity 0.3s ease-in-out, transform 0.5s ease-out"
                    _hover={{ transform: "scale(1.05)", opacity: 1 }}
                    borderRadius="xs" // Decreased corner radius for the image itself
                  />
                  <Box 
                    position="absolute" top="0" left="0" right="0" bottom="0"
                    bgGradient="linear(to-t, blackAlpha.700, transparent 70%)" // Adjusted gradient
                    zIndex={0}
                  />
                  <Box 
                    position="absolute"
                    bottom={{ base: 3, md: 4 }}
                    left={{ base: 3, md: 4 }}
                    right={{ base: 3, md: 4 }}
                    color="white"
                    zIndex={1}
                    opacity={index === selectedIndex ? 1 : 0}
                    transform={index === selectedIndex ? 'translateY(0)' : 'translateY(20px)'}
                    transition="opacity 0.4s ease-in-out, transform 0.4s ease-in-out"
                    p={{ base: 2, md: 3 }}
                    borderRadius="sm"
                  >
                    <Heading fontSize={{ base: "lg", md: "xl" }} mb={{ base: 1, md: 2 }} fontFamily="'Playfair Display', serif" textShadow="0 2px 5px rgba(0,0,0,0.7)">
                      {item.title}
                    </Heading>
                    <Text fontSize={{ base: "sm", md: "md" }} fontFamily="'Playfair Display', serif" textShadow="0 1px 3px rgba(0,0,0,0.5)" noOfLines={2}> {/* Reduced noOfLines for potentially smaller cards */}
                      {item.subtitle}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>

        {emblaApi && (
          <>
            <Box
              as="button"
              className="embla__button" 
              onClick={scrollPrev}
              position="absolute" 
              // Adjusted button positioning for potentially wider carousel view
              left={{ base: "5px", md: "10px", lg: 'calc(50% - var(--slide-size) * 2.5 - 70px)' }} 
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              // Button background and icon color might need adjustment for white bg
              // These are primarily controlled by .embla__button in CSS
            >
              <ChevronLeft className="embla__button__svg" size={isMobile ? 20 : 28} />
            </Box>
            <Box
              as="button"
              className="embla__button" 
              onClick={scrollNext}
              position="absolute"
              right={{ base: "5px", md: "10px", lg: 'calc(50% - var(--slide-size) * 2.5 - 70px)' }} 
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
            >
              <ChevronRight className="embla__button__svg" size={isMobile ? 20 : 28} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CarouselSection;