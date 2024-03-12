import Header from "./Components/header.tsx";
import Hero from "./Components/hero.tsx";
import Features from "./Components/features.tsx";
import Testimonials from "./Components/Testimonials.tsx";
import NewsLetter from "./Components/newsletter.tsx";
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
