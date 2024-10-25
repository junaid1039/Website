import React from 'react';
import './pitem.css';
import { Link } from 'react-router-dom';

const Pitem = (props) => {
  const mainImage = props.image &&  props.image[0];

  return (
    <Link to={`/product/${props.id}`} className='cl'>
    <div className="pitem" onClick={window.scrollTo(0,0)}>
        <img src={mainImage}/>
        <p>{props.name}</p>
        <div className="prices">
            <span>${props.oldprice}</span>
            <span>${props.newprice}</span>
        </div>
    </div>
    </Link>
  )
};

export default Pitem;

