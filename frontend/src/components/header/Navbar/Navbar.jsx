import React, { useState, useEffect, useContext, useCallback } from 'react';
import './navbar.css';
import logo from '../../../assets/logo.png';
import { RxHamburgerMenu } from "react-icons/rx";
import { PiHandbag } from "react-icons/pi";
import { GoPerson } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai'; 
import { BsPeople } from "react-icons/bs";
import { Context } from '../../../context API/Contextapi';
import { FaUserCheck } from "react-icons/fa6";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { gettotalcartitems, isLoggedIn } = useContext(Context);

  // Handle scroll to add/remove scrolled class
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Toggle menu visibility
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="child-nav">
          <div className="left">
            <div className="menu" onClick={toggleMenu} aria-label="Toggle Menu">
              <RxHamburgerMenu />
              <span>Menu</span>
            </div>
            <div className="search">
              <CiSearch />
              <input type='text' placeholder='Search' aria-label='Search products' />
            </div>
          </div>
          <div className="middle">
            <Link to='/' className='cl'>
              <img src={logo} alt='Company Logo' />
            </Link>
          </div>
          <div className="right">
            <Link to="/account" className='cl'>
              <div className="account">
                {isLoggedIn ? <FaUserCheck /> : <GoPerson />}
                <span>Account</span>
              </div>
            </Link> 
            <Link to='/cart' className='cl'>
              <div className="cart">
                <div className='subcart'>
                  <PiHandbag />
                  {gettotalcartitems() > 0 && <span>{gettotalcartitems()}</span>}
                </div>
                <span className='tcart'>Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sliding Menu Overlay */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="sub-overlay">
          <div className="menu-header">
            <span>Menu</span>
            <AiOutlineClose className="close-icon" onClick={toggleMenu} aria-label="Close Menu" />
          </div>
          <ul className="menu-items">
            {['/', '/women shoes', '/bags', '/perfumes', '/wallets', '/men shoes', '/belts', '/horse saddles'].map((item, index) => (
              <li key={index}>
                <Link className='cl' to={item} onClick={toggleMenu}>
                  {item.charAt(1).toUpperCase() + item.slice(2)} {/* Capitalize first letter */}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="menubottom">
          <h5><span><BsPeople /></span>About us</h5>
          <Link className='cl' to="/login" ><h5><span><GoPerson /></span>Account</h5></Link>
        </div>
      </div>

      {/* Background overlay when menu is open */}
      {isMenuOpen && <div className="backdrop" onClick={toggleMenu} aria-label="Close Menu Overlay"></div>}
    </>
  );
};

export default Navbar;
