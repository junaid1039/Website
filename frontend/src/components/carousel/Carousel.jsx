import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

import "./Bcarosel.css"; 

const Bcarosel = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prevSlide) =>
        prevSlide === slides.slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 4000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const nextSlide = () => {
    setSlide((prevSlide) =>
      prevSlide === slides.slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setSlide((prevSlide) =>
      prevSlide === 0 ? slides.slides.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="main-c">
    <div className="carousel">
      <IoIosArrowBack onClick={prevSlide} className="arrow arrow-left" />
      {slides.slides.map((item, idx) => (
        <img
          src={item.src}
          alt={item.alt}
          key={idx}
          className={slide === idx ? "slide" : "slide slide-hidden"}
        />
      ))}
      <IoIosArrowForward onClick={nextSlide} className="arrow arrow-right" />
      <span className="indicators">
        {slides.slides.map((_, idx) => (
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
