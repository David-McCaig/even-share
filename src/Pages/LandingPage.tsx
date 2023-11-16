import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Landing from '../features/landingpage/index';

function LandingPage() {
    useEffect(() => {
      // Initialize AOS with the desired configuration
      AOS.init({
        once: true,
        disable: 'phone',
        duration: 700,
        easing: 'ease-out-cubic',
      });
    }, []); // Ensure the effect runs only once on mount
  
    return (
      <div>
        <Landing />
      </div>
    );
  }
  
  export default LandingPage;