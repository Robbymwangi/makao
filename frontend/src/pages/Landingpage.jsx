import React from "react";
import { Container } from "@chakra-ui/react";
import HeroSection from "../usercomponents/HeroSection";
import Carousel from "../usercomponents/Carousel";

const Landingpage = () => {
  return (
    <Container maxW="7xl" py={14}>
      <HeroSection />
      <Carousel />
    </Container>
  );
};

export default Landingpage;