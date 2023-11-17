// import "../../App.css"
import React from "react";
import Header from "./Components/header";
import Hero from "./Components/hero";
import Features from "./Components/features";
import Testimonials from "./Components/Testimonials";
import NewsLetter from "./Components/newsletter"
// Import Inter font directly

// Set up Inter font configurations

function Index() {
  return (
    <>
      <Header />
      <Hero />
      <Features/>
      <Testimonials/>
      <NewsLetter/>
    </>
  );
}

export default Index;
