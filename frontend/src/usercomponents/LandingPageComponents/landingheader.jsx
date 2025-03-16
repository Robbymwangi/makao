import React, { useState } from 'react';
import {
  Box,
  Flex,
  Link,
  Heading,
  HStack,
  Button,
  VStack,
  DrawerFooter,
} from '@chakra-ui/react';
import {useNavigate} from 'react-router';

"use client";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from 'lucide-react';
import { ColorModeButton } from '@/components/ui/color-mode';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Testimonials', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Our Agents', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const LandingHeader = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <>
      {/* Wrapper for backdrop blur */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex="overlay"
        backdropFilter={open ? 'blur(10px)' : 'none'}
        bg={open ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}
        pointerEvents={open ? 'auto' : 'none'}
      />

      {/* Header */}
      <Box
        position="fixed"
        top={4}
        left={0}
        right={0}
        zIndex="sticky"
        mx="auto"
        maxW="container.xl"
        px={4}
      >
        <Flex
          as="header"
          bg="rgba(255, 255, 255, 0.8)"
          backdropFilter="blur(10px)"
          px={6}
          py={3}
          align="center"
          justify="space-between"
          borderRadius="full"
          boxShadow="md"
        >
          {/* Heading/Logo */}
          <Heading
            as="h1"
            size="2xl"
            fontFamily="'Playfair Display', serif"
            fontWeight="bold"
            paddingLeft={{ base: '0', lg: '114px' }}
          >
            Makao
          </Heading>

          {/* Navigation Links - Large devices */}
          <HStack
            spacing={30}
            display={{ base: 'none', lg: 'flex' }}
            justify={"center"}
            align={"center"}
            flex={"2"}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                fontFamily="'Playfair Display', serif"
                fontSize="md"
                color="black"
                padding={'.5em'}
                _hover={{ color: 'gray.600' }}
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          {/* Buttons - Large devices */}
          <HStack spacing={8} display={{ base: 'none', lg: 'flex' }} paddingRight={{ base: '0', lg: '114px' }}>
            <Button variant="outline" onClick={handleLoginClick}>
              Log In
            </Button>
            <Button onClick={handleSignUpClick}>Sign Up</Button>
            <ColorModeButton />
          </HStack>

          {/* Navigation Links - Small devices (Drawer) */}
          <Box display={{ base: 'block', lg: 'none' }}>
            <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DrawerBackdrop />
              <DrawerTrigger asChild>
                <Button variant="ghost">
                  <Menu size={24} />
                </Button>
              </DrawerTrigger>
              <DrawerContent offset="6" rounded="md">
                <DrawerHeader>
                  <DrawerTitle fontWeight={"bold"} fontSize={"2xl"}>Menu</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <VStack align="start">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        fontFamily="'Playfair Display', serif"
                        fontSize="xl"
                        color="black"
                        _hover={{ color: 'gray.600' }}
                        paddingBlock={15}
                        onClick={() => setOpen(false)} // Close drawer on link click
                      >
                        {link.label}
                      </Link>
                    ))}
                  </VStack>
                </DrawerBody>
                <DrawerFooter>
                  <VStack spacing={4} width="100%">
                    <ColorModeButton />
                    <Button width="100%" variant={"outline"} onClick={handleSignUpClick}>Sign Up</Button>
                    <Button width="100%" onClick={handleLoginClick}>Log In</Button>
                  </VStack>
                </DrawerFooter>
                <DrawerCloseTrigger />
              </DrawerContent>
            </DrawerRoot>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default LandingHeader;