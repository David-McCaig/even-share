// import "../../App.css"
import React from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Features from "./Components/features";
import Testimonials from "./Components/Testimonials";
import NewsLetter from "./Components/Newsletter"
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
