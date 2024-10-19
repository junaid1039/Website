import React, { useState, useEffect, useContext } from 'react';
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
  const { gettotalcartitems, isLoggedIn } = useContext(Context); // Use isLoggedIn from context

  // Handle scroll to add/remove scrolled class
  const handleScroll = () => {
    if (window.scrollY > 20) { 
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="child-nav">
          <div className="left">
            <div className="menu" onClick={toggleMenu}>
              <RxHamburgerMenu />
              <span>Menu</span>
            </div>
            <div className="search">
              <CiSearch />
              <input type='text' placeholder='Search' />
            </div>
          </div>
          <div className="middle">
            <Link to='/' className='cl'>
              <img src={logo} alt='logo' />
            </Link>
          </div>
          <div className="right">
            <Link to="/account" className='cl'>
              <div className="account">
                {/* Conditionally render the icon based on login status from context */}
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
            <AiOutlineClose className="close-icon" onClick={toggleMenu} />
          </div>
          <ul className="menu-items">
            <li><Link className='cl' to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link className='cl' to="/women shoes" onClick={toggleMenu}>Women Shoes</Link></li>
            <li><Link className='cl' to="/bags" onClick={toggleMenu}>Handbags</Link></li>
            <li><Link className='cl' to="/perfumes" onClick={toggleMenu}>Fragrances</Link></li>
            <li><Link className='cl' to="/wallets" onClick={toggleMenu}>Wallets</Link></li>
            <li><Link className='cl' to="/men shoes" onClick={toggleMenu}>Men Shoes</Link></li>
            <li><Link className='cl' to="/belts" onClick={toggleMenu}>Belts</Link></li>
            <li><Link className='cl' to="/horse saddles" onClick={toggleMenu}>Horse Saddle</Link></li>
          </ul>
        </div>
        <div className="menubottom">
          <h5><span><BsPeople /></span>About us</h5>
          <Link className='cl' to="/login" ><h5><span><GoPerson /></span>Account</h5></Link>
        </div>
      </div>

      {/* Background overlay when menu is open */}
      {isMenuOpen && <div className="backdrop" onClick={toggleMenu}></div>}
    </>
  );
};

export default Navbar;
