import React from 'react';
import './citem.css';

export const Citems = (props) => {
  return (
    <div className="citem">
        <img src={props.image}/>
        <p>{props.name}</p>
    </div>
  )
}

export default Citems;