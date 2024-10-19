import React from 'react';
import './pitem.css';
import { Link } from 'react-router-dom';

const Pitem = (props) => {
  return (
    <Link to={`/product/${props.id}`} className='cl'>
    <div className="pitem" onClick={window.scrollTo(0,0)}>
        <img src={props.image}/>
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
