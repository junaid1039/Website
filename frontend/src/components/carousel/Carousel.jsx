import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Context } from '../../context API/Contextapi';
import "./carousel.css";
import { useNavigate } from "react-router-dom";

const Bcarousel = () => {
  const { fetchCarousels } = useContext(Context);
  const [slides, setSlides] = useState([]);
  const currentSlideRef = useRef(0); // useRef to persist the slide index
  const [_, forceRender] = useState(0); // State to force render
  const navigate = useNavigate();

  // Memoize fetchCarousels to avoid redundant data fetching
  const memoizedSlides = useMemo(async () => {
    const fetchedSlides = await fetchCarousels();
    return fetchedSlides.filter(slide => slide.subcategory === null);
  }, [fetchCarousels]);

  // Load slides only once and cache in the component
  useEffect(() => {
    memoizedSlides.then(setSlides);
  }, [memoizedSlides]);

  // Auto-slide feature using useRef
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        currentSlideRef.current = (currentSlideRef.current + 1) % slides.length;
        forceRender(n => n + 1); // Trigger a render
      }, 4000);
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    currentSlideRef.current = (currentSlideRef.current + 1) % slides.length;
    forceRender(n => n + 1); // Trigger a render
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    currentSlideRef.current = (currentSlideRef.current - 1 + slides.length) % slides.length;
    forceRender(n => n + 1); // Trigger a render
  }, [slides.length]);

  if (!slides.length) {
    return <div className="carousel-error">No slides available</div>;
  }

  const current = slides[currentSlideRef.current];

  return (
    <div className="carousel-container">
      <div className="carousel">
        <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
        
        <div className="slide-container">
          {slides.map((item, idx) => (
            <div 
              key={idx} 
              className={`slide ${currentSlideRef.current === idx ? "slide-active" : "slide-hidden"}`}
            >
              <img 
                src={item.carousel} 
                alt={`Slide ${idx}`} 
                loading="lazy"  // Lazy load images to enhance performance
              />
            </div>
          ))}
        </div>

        <div className="carousel-overlay">
          <h2 className="carousel-title">{current.title}</h2>
          <p className="carousel-description">{current.description}</p>
          <label
            className="carousel-button"
            onClick={() => navigate(current.linkto)}
          >
            {current.buttonText || "Discover"}
          </label>
        </div>

        <IoIosArrowForward onClick={nextSlide} className="arrow arrow-right" />

        <div className="indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${currentSlideRef.current === idx ? "indicator-active" : ""}`}
              onClick={() => { currentSlideRef.current = idx; forceRender(n => n + 1); }}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bcarousel;
