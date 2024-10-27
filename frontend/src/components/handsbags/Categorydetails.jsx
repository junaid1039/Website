import React from 'react';
import './handbags.css';
import Pitem from '../p-items/Pitem';
import { Link } from 'react-router-dom';


const Categorydetails = (props) => {
  let handbags = props.data;
  return (
    <div className="handbags">
      <div className="sub-handbags">
        <div className="headings">
        <h5>{props.heading}</h5>
        <p>{props.oneliner}</p>
       <Link to={`/${props.category}`} className='cl' > <button>Discover</button> </Link>
        </div>
        <div className="banner">
          <img src={props.banner} alt='banner' loading='lazy'/>
        </div>
        <div className="products">
         {handbags.map((item,i)=>{
          return <Pitem key={i} image={item.image} name={item.name} oldprice={item.oldprice} newprice={item.newprice} />
         })}
        </div>
      </div>
    </div>
  )
};

export default Categorydetails;
