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
  DrawerTitle,
  DrawerRoot,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from 'lucide-react';
import { ColorModeButton } from '@/components/ui/color-mode';

// Add this CSS in the same file or in your global CSS
const megaMenuStyles = `
.mega-menu-container {
  position: relative;
  display: inline-block;
}
.mega-menu-trigger {
  cursor: pointer;
  transition: color 0.2s;
}
.mega-menu-trigger:hover {
  color: #4A5568;
}
.mega-menu {
  display: none;
  position: absolute;
  left: 0;
  top: 2.5em;
  background: white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border-radius: 8px;
  min-width: 340px;
  padding: 2rem 2.5rem 2rem 2rem;
  z-index: 1000;
}
.mega-menu-container:hover .mega-menu,
.mega-menu-container:focus-within .mega-menu {
  display: block;
}
.mega-menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem 2.5rem;
}
.mega-menu-link {
  color: #2D3748;
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}
.mega-menu-link:hover {
  color: #3182CE;
}
.mega-menu-wide {
  min-width: 1200px; /* Increase the width */
  max-width: 1400px; /* Optional: Set a max width */
  padding: 2.5rem 2.5rem 2.5rem 2rem;
}

.mega-menu-grid-wide {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Add a third column */
  gap: 2rem; /* Increase spacing between columns */
  align-items: start;
}
`;

// Inject the CSS once
if (typeof window !== "undefined" && !document.getElementById("megamenu-style")) {
  const style = document.createElement("style");
  style.id = "megamenu-style";
  style.innerHTML = megaMenuStyles;
  document.head.appendChild(style);
}

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Testimonials', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Our Agents', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const agentsMenu = [
  { label: "Find an Agent", href: "#" },
  { label: "Become an Agent", href: "#" },
  { label: "Agent Resources", href: "#" },
  { label: "Agent Success Stories", href: "#" },
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
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="sticky"
        mx="auto"
        maxW="container.xl"
        px={4}
        bg="rgba(255, 255, 255, 0.95)"
        boxShadow="sm"
      >
        <Flex
          align="center"
          justify="space-between"
          py={3}
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
            {navLinks.map((link) =>
              link.label === "Our Agents" ? (
                <span className="mega-menu-container" key={link.label}>
                  <span className="mega-menu-trigger" tabIndex={0}>
                    {link.label}
                  </span>
                  <div className="mega-menu mega-menu-wide">
                    <div className="mega-menu-grid mega-menu-grid-wide">
                      {/* First Column */}
                      <div>
                        <div style={{ marginBottom: "1.5rem" }}>
                          <strong style={{ fontSize: "1.1rem", color: "#2D3748" }}>Agent Services</strong>
                          <div style={{ color: "#4A5568", fontSize: "0.95rem", marginTop: "0.3rem" }}>
                            Everything you need to connect, grow, and succeed as an agent.
                          </div>
                        </div>
                        <a href="#" className="mega-menu-link">
                          Find an Agent
                        </a>
                        <div style={{ color: "#718096", fontSize: "0.92rem", marginBottom: "1.2rem" }}>
                          Search our network of trusted agents.
                        </div>
                        <a href="#" className="mega-menu-link">
                          Become an Agent
                        </a>
                        <div style={{ color: "#718096", fontSize: "0.92rem" }}>
                          Join Makao and start your journey.
                        </div>
                      </div>

                      {/* Second Column */}
                      <div>
                        <a href="#" className="mega-menu-link">
                          Agent Resources
                        </a>
                        <div style={{ color: "#718096", fontSize: "0.92rem", marginBottom: "1.2rem" }}>
                          Tools and guides for your success.
                        </div>
                        <a href="#" className="mega-menu-link">
                          Agent Success Stories
                        </a>
                        <div style={{ color: "#718096", fontSize: "0.92rem" }}>
                          Read how agents are thriving with Makao.
                        </div>
                        <div style={{ borderTop: "1px solid #E2E8F0", marginTop: "2rem", paddingTop: "1rem" }}>
                          <a href="#" className="mega-menu-link" style={{ color: "#3182CE", fontWeight: 600 }}>
                            Learn more about our agent program &rarr;
                          </a>
                        </div>
                      </div>

                      {/* Third Column (Image) */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=320&h=320&q=80"
                          alt="Makao Agent"
                          style={{
                            borderRadius: "12px",
                            width: "300px",
                            height: "200px",
                            objectFit: "cover",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.10)"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </span>
              ) : (
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
              )
            )}
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