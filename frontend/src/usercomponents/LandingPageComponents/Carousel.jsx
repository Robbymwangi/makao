import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  Image
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const TWEEN_FACTOR_BASE = 0.3;

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
    { id: 1, title: 'Vibrant Neighborhood', subtitle: 'Perfect for young professionals', image: 'https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3' },
    { id: 2, title: 'Spacious Family Homes', subtitle: 'Green spaces & great schools', image: 'https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3' },
    { id: 3, title: 'Luxury Apartments', subtitle: 'Premium amenities & city views', image: 'https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3' },
    { id: 4, title: 'Cozy Studios', subtitle: 'Affordable city living', image: 'https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3' },
    { id: 5, title: 'Modern Lofts', subtitle: 'Industrial-chic spaces', image: 'https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3' },
  ];

  // Tween scale functionality
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__tween');
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0.7, 1).toString();
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

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale);
  }, [emblaApi, tweenScale, setTweenNodes, setTweenFactor]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <Box py={20} position="relative" overflow="hidden">
      <Box maxW="7xl" mx="auto" px={4} mb={12} textAlign="center">
        <Heading fontSize="3xl" mb={4} fontFamily="'Playfair Display', serif">
          We get it, Building your dream home can be a nightmare.
        </Heading>
        <Text fontSize="xl" maxW="2xl" mx="auto" fontFamily="'Playfair Display', serif">
         That is why at Makao, we make building your own home simple, stress-free, and tailored to your needs. 
         And for those looking for inspiration, our team of experts will help you get exactly what you want, with no fuss.
        </Text>
      </Box>

      <Box className="embla" position="relative" ref={emblaRef}>
        <Flex className="embla__container" minH="100px">
          {carouselItems.map((item, index) => (
            <Box
              key={item.id}
              className="embla__slide"
              flex={`0 0 ${isMobile ? '70%' : '400px'}`}
              minW="8"
              position="relative"
              sx={{
                perspective: '1000px',
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {/* Tweenable inner element */}
              <Box className="embla__slide__tween">
                <Box
                  bg="gray.100"
                  h={{ base: '350px', md: '616px' }}
                  w={{ base: '100%', md: '356px' }}
                  borderRadius="2xl"
                  overflow="hidden"
                  position="relative"
                  mx="auto"
                  boxShadow="xl"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    objectFit="cover"
                    h="100%"
                    w="100%"
                    borderRadius="2xl"
                  />
                  <Box
                    position="absolute"
                    bottom="8"
                    left="8"
                    right="8"
                    color="white"
                    zIndex={1}
                    opacity={index === selectedIndex ? 1 : 0}
                    transition="opacity 0.3s ease-in-out"
                    bg="blackAlpha.500"
                    p={4}
                    borderRadius="lg"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  >
                    <Heading fontSize="xl" mb={2} fontFamily="'Playfair Display', serif" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                      {item.title}
                    </Heading>
                    <Text fontSize="md" fontFamily="'Playfair Display', serif" textShadow="0 1px 2px rgba(0,0,0,0.2)">
                      {item.subtitle}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>

        {/* Navigation buttons with responsive positioning */}
        <Box
          as="button"
          onClick={scrollPrev}
          position="absolute"
          left={{ base: 2, md: '-80px' }}  // Outside carousel on larger screens
          top="50%"
          transform="translateY(-50%)"
          fontSize={{ base: '24px', md: '32px' }}
          p={2}
          borderRadius="full"
          bg="whiteAlpha.700"
          zIndex={2}
          _hover={{ bg: 'whiteAlpha.900' }}
        >
          <ChevronLeft />
        </Box>
        <Box
          as="button"
          onClick={scrollNext}
          position="absolute"
          right={{ base: 2, md: '-80px' }}  // Outside carousel on larger screens
          top="50%"
          transform="translateY(-50%)"
          fontSize={{ base: '24px', md: '32px' }}
          p={2}
          borderRadius="full"
          bg="whiteAlpha.700"
          zIndex={2}
          _hover={{ bg: 'whiteAlpha.900' }}
        >
          <ChevronRight />
        </Box>
      </Box>
    </Box>
  );
};

export default CarouselSection;
