import React from "react";
import { Container } from "@chakra-ui/react";
import HeroSection from "../usercomponents/LandingPageComponents/HeroSection";
import Carousel from "../usercomponents/LandingPageComponents/Carousel";
import AgentSection from "../usercomponents/LandingPageComponents/AgentSection";
import ClientShowcase from "../usercomponents/LandingPageComponents/ClientShowcase";
import Testimonials from "../usercomponents/LandingPageComponents/Testimonials";
import FAQ from "../usercomponents/LandingPageComponents/FAQ";
import LatestArticles from "../usercomponents/LandingPageComponents/Articles";
import EmailList from "../usercomponents/LandingPageComponents/EmailList";
import Footer from "../usercomponents/LandingPageComponents/Footer";

const Landingpage = () => {
  return (
    <Container maxW="7xl" py={26}>
      <HeroSection />
      <ClientShowcase />
      <Carousel />
      <AgentSection />
      <Testimonials />
      <FAQ />
      <LatestArticles />
      <EmailList />
      <Footer />
    </Container>
  );
};

export default Landingpage;