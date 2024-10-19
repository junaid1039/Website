import React from 'react';
import './category.css';
import Citems from '../c-items/Citems';
import category from '../../assets/categroys/category.js';
import { Link } from 'react-router-dom';

const Categorys = () => {
    return (
        <div className="category">
            <div className="sub-category">
                <h5>Trending Categorys</h5>
                <p>Discover top-quality products curated just for you at unbeatable prices!</p>
                <div className="category-items">

                    {category.map((item, i) => {
                        return (<Link className='cl' key={i} to={`/${item.category}`}> <Citems key={i} name={item.name} image={item.image} /> </Link>
                        )
                    })}


                </div>
            </div>
        </div>
    )
};

export default Categorys;
