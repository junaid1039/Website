import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Context } from '../../context API/Contextapi';
import "./carousel.css";
import { useNavigate } from "react-router-dom";

const Bcarousel = () => {
  const { fetchCarousels } = useContext(Context);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Load slides once when component mounts
  useEffect(() => {
    const loadSlides = async () => {
      const fetchedSlides = await fetchCarousels();
      const filteredSlides = fetchedSlides.filter(slide => slide.subcategory === null);
      setSlides(filteredSlides);
    };
    loadSlides();
  }, [fetchCarousels]);

  // Auto-slide feature
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }, [slides.length]);

  if (!slides.length) {
    return <div className="carousel-error">No slides available</div>;
  }

  const current = slides[currentSlide];

  return (
    <div className="carousel-container">
      <div className="carousel">
        <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
        
        <div className="slide-container">
          {slides.map((item, idx) => (
            <div 
              key={idx} 
              className={`slide ${currentSlide === idx ? "slide-active" : "slide-hidden"}`}
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
              className={`indicator ${currentSlide === idx ? "indicator-active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bcarousel;
