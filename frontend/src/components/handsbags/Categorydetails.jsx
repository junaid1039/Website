import React from 'react';
import './handbags.css';
import Pitem from '../p-items/Pitem';
import { Link } from 'react-router-dom';

const Categorydetails = React.memo(({ data, heading, oneliner, category, banner }) => {
  return (
    <div className="handbags">
      <div className="sub-handbags">
        <div className="headings">
          <h5>{heading}</h5>
          <p>{oneliner}</p>
          <Link to={`/${category}`} className="cl">
            <button>Discover</button>
          </Link>
        </div>
        <div className="banner">
          <img src={banner || 'path/to/fallback-banner.jpg'} alt="banner" loading="lazy" />
        </div>
        <div className="products">
          {data.map((item) => (
            <Pitem 
              key={item.id || item.name}  // Use a unique ID if available
              id={item.id}
              image={item.images} 
              name={item.name} 
              oldprice={item.oldprice} 
              newprice={item.newprice}
              countryCode={item.countryCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Categorydetails;
