import React from 'react';
import './footer.css';
import logo from '../../assets/logo.png'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { TfiYoutube } from "react-icons/tfi";



const Footer = () => {

  const year = new Date().getFullYear();
  return (
    <>
    <div className="footer">
        <div className="c-footer">
        <div className="f-left">
            <h5>Customer Service</h5>
            <p>Monday to Friday: 9am - 9pm EST, Saturday: 10am - 9pm EST</p>
            <a>phone number</a>
            <a>Contact us</a>
        </div>
        <div className="f-middle">
        <h5>NewsLetter</h5>
        <p>Receive our newsletter and discover our stories, collections, and surprises.</p>
        <button>Subscribe</button>
        </div>
        <div className="f-right">
        <h5>Follow us</h5>
        <div className="social">
            <FaFacebookF/>
            <FaInstagram/>
            <FaXTwitter/>
            <TfiYoutube/>
        </div>
        </div>
        </div>
    </div>
    <div className="copyright">
      <img src={logo}/>
        <p>© DAYMIFY {year}. All rights reserved.</p>
    </div>
    </>
  )
};

export default Footer;
