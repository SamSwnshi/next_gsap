"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const Home = () => {
  const carouselImages = [
    { src: "/assets/cat-1.jpg", alt: "First slide" },
    { src: "/assets/cat-2.jpg", alt: "Second slide" },
    { src: "/assets/cat-3.jpg", alt: "Third slide" },
    { src: "/assets/cat-4.jpg", alt: "Fourth slide" },
    { src: "/assets/cat-5.jpg", alt: "Fifth slide" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Function to move to a specific index
  const slideTo = (index) => {
    gsap.to(containerRef.current.children, {
      xPercent: (i) => (i - index) * 100,
      scale: (i) => (i === index ? 1 : 0.85),
      opacity: (i) => (i === index ? 1 : 0.5),
      duration: 1,
      ease: "power2.inOut",
    });

    setCurrentIndex(index);
  };

  // Auto-slide function
  useEffect(() => {
    // Reset to first slide on mount
    slideTo(0);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselImages.length;
        slideTo(nextIndex);
        return nextIndex;
      });
    }, 4000); 

    return () => clearInterval(intervalRef.current);
  }, []); 

  return (
    <div className="max-w-5xl mx-auto relative py-10">
      <h1 className="text-3xl font-bold text-center mb-6">GSAP Auto-Carousel</h1>

      <div className="relative overflow-hidden w-full">
        <div ref={containerRef} className="flex items-center justify-center relative h-[500px]">
          {carouselImages.map((image, index) => (
            <div key={index} className="absolute w-[90%] md:w-[60%] lg:w-[50%]">
              <Image
                src={image.src}
                alt={image.alt}
                width={900}
                height={500}
                className="rounded-lg mx-auto shadow-lg"
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

       
        <button
          onClick={() => slideTo((currentIndex - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
        >
          ❮
        </button>
        <button
          onClick={() => slideTo((currentIndex + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
        >
          ❯
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => slideTo(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
