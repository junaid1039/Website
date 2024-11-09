import React, { useState, useEffect, useContext } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Context } from '../../context API/Contextapi';
import "./carousel.css";
import { useNavigate } from "react-router-dom";

const Bcarosel = () => {
  const { fetchCarousels } = useContext(Context);
  const [slides, setSlides] = useState([]);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSlides = async () => {
      const fetchedSlides = await fetchCarousels();
      const filteredSlides = fetchedSlides.filter(slide => slide.subcategory === null);
      setSlides(filteredSlides);
    };
    loadSlides();
  }, [fetchCarousels]);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [slides]);

  const nextSlide = () => {
    setSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  if (!slides || slides.length === 0) {
    return <div className="carousel-error">No slides available</div>;
  }

  const currentSlide = slides[slide]; // Get the currently active slide

  return (
    <div className="main-c">
      <div className="carousel">
        <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
        
        {slides.map((item, idx) => (
          <div key={idx} className={slide === idx ? "slide" : "slide slide-hidden"}>
            <img src={item.carousel} alt={`Slide ${idx}`} />
          </div>
        ))}

        {/* Overlay content for the current slide */}
        {currentSlide && (
          <div className="carousel-overlay">
            <h2 className="carousel-title">{currentSlide.title}</h2>
            <p className="carousel-description">{currentSlide.description}</p>
            <label
              className="carousel-button"
              onClick={() => navigate(currentSlide.linkto)}
            >
              {currentSlide.buttonText || "Discover"}
            </label>
          </div>
        )}

        <IoIosArrowForward onClick={nextSlide} className="arrow arrow-right" />
        
        <span className="indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={slide === idx ? "indicator" : "indicator indicator-inactive"}
              onClick={() => setSlide(idx)}
            ></button>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Bcarosel;
