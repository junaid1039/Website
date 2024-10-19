import React, { useState } from 'react';
import './menu.css';
import { RxCross2 } from "react-icons/rx";


const Menu = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="menu">
            <div className="close">
                <h5>Menu</h5>
                <RxCross2 />
            </div>
            <div className={`dropdown ${isOpen ? 'show' : ''}`}>
                <button className="dropbtn" onClick={toggleDropdown}>
                    <span className="icon">{isOpen ? '-' : '+'}</span> Dropdown
                </button>
                <div className="dropdown-content">
                    <a href="#">Option 1</a>
                    <a href="#">Option 2</a>
                    <a href="#">Option 3</a>
                </div>
            </div>
        </div>
    );
};

export default Menu;
