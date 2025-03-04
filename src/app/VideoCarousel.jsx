'use client'
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

const VideoCarousel = ({ images }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const timelineRef = useRef(null);

    console.log("Images prop:", images);

  
    // Initialize the GSAP timeline
    useEffect(() => {
      timelineRef.current = gsap.timeline({ paused: true })
        .set(containerRef.current.children, { 
          position: 'absolute',
          opacity: 0,
          scale: 0.8,
        })
        .set(containerRef.current.children[0], { 
          opacity: 1,
          scale: 1,
          zIndex: 10
        });
      
      // Setup animation for each slide
      for (let i = 0; i < images.length; i++) {
        const nextIndex = (i + 1) % images.length;
        
        timelineRef.current.to(containerRef.current.children[i], {
          opacity: 0,
          scale: 0.8,
          zIndex: 1,
          duration: 0.5,
        }, `slide${i}`)
        .to(containerRef.current.children[nextIndex], {
          opacity: 1,
          scale: 1,
          zIndex: 10,
          duration: 0.5,
          onComplete: () => {
            setCurrentIndex(nextIndex);
          }
        }, `slide${i}+=0.25`);
      }
      
      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
      };
    }, [images]);
  
    // Control auto-play functionality
    useEffect(() => {
      let interval;
      
      if (isPlaying && timelineRef.current) {
        interval = setInterval(() => {
          const progress = timelineRef.current.progress();
          const segmentDuration = 1 / images.length;
          const nextProgress = progress + segmentDuration;
          
          if (nextProgress >= 1) {
            timelineRef.current.progress(0);
          } else {
            timelineRef.current.progress(nextProgress);
          }
        }, 3000);
      }
      
      return () => clearInterval(interval);
    }, [isPlaying, images]);
  
    const togglePlayPause = () => {
      setIsPlaying(!isPlaying);
    };
  
    const goToSlide = (index) => {
      const segmentDuration = 1 / images.length;
      timelineRef.current.progress(segmentDuration * index);
      setCurrentIndex(index);
    };
  
    return (
      <div className="relative overflow-hidden w-full" style={{ aspectRatio: '16/9' }}>
        {/* Carousel container */}
        <div 
          ref={containerRef} 
          className="w-full h-full bg-black rounded-lg relative"
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className="w-full h-full absolute top-0 left-0"
            >
              <Image
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                fill
                objectFit="cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-20">
          <button 
            onClick={togglePlayPause}
            className="bg-white/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/50 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          
          {/* Progress indicators */}
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Simple icon components
  const PlayIcon = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
  
  const PauseIcon = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
  
  export default VideoCarousel;