import React, { useState, useEffect, useContext } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Context } from '../../context API/Contextapi';
import "./carousel.css";
import { Link } from "react-router-dom";

const Bcarosel = () => {
  const { fetchCarousels } = useContext(Context);
  const [slides, setSlides] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      const fetchedSlides = await fetchCarousels();
      setSlides(fetchedSlides);
    };
    loadSlides();
  }, [fetchCarousels]);

  useEffect(() => {
    if (slides && slides.length > 0) {
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

  // Check if slides exist
  if (!slides || slides.length === 0) {
    return <div className="carousel-error">No slides available</div>;
  }

  return (
    <div className="main-c">
      <div className="carousel">
        <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
        {slides.map((item, idx) => (
          <Link to={item.linkto}><img
            src={item.carousel} // Assuming each slide has a `carousel` field for the image URL
            alt={`Slide ${idx}`}
            key={idx}
            className={slide === idx ? "slide" : "slide slide-hidden"}
          /></Link>
        ))}
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
