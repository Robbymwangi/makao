import React from "react";
import { Container } from "@chakra-ui/react";
import HeroSection from "../usercomponents/HeroSection";
import Carousel from "../usercomponents/Carousel";
import AgentSection from "../usercomponents/AgentSection";
import ClientShowcase from "../usercomponents/ClientShowcase";
import Testimonials from "@/usercomponents/Testimonials";
import FAQ from "@/usercomponents/FAQ";
import LatestArticles from "@/usercomponents/Articles";
import EmailList from "@/usercomponents/EmailList";
import Footer from "@/usercomponents/Footer";


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