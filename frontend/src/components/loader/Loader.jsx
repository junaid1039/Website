// Loader.js
import React from 'react';
import './loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
            </div>
            <h2>Loading...</h2>
        </div>
    );
};

export default Loader;
