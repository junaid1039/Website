import React, { useState, useContext } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Myorders from "../../../components/userinfo/orders/Myorders";
import Adressbook from "../../../components/userinfo/adressbook/Adressbook";
import Pi from "../../../components/userinfo/pi/Pi";
import { Context } from "../../../context API/Contextapi";
import './login.css';

const Login = () => {
    const { signup, login, handleLogout } = useContext(Context);
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: ""
    });

    // Set the default link to 'userinfo'
    const [activeLink, setActiveLink] = useState('userinfo');
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
        navigate(`/${link}`); // Navigate to the selected link
    };

    return (
        <div>
            {sessionStorage.getItem('auth-token') ? (
                <>
                    <div className="myacc">My Account</div>
                    <div className="main">
                        <div className="u-left">
                            <Link
                                className={`cl ${activeLink === 'userinfo' ? 'active' : ''}`}
                                to="userinfo"
                                onClick={() => handleLinkClick('userinfo')}>
                                <h4>Profile</h4>
                            </Link>
                            <Link
                                className={`cl ${activeLink === 'addressbook' ? 'active' : ''}`}
                                to="addressbook"
                                onClick={() => handleLinkClick('addressbook')}>
                                <h4>Addresses</h4>
                            </Link>
                            <Link
                                className={`cl ${activeLink === 'myorders' ? 'active' : ''}`}
                                to="myorders"
                                onClick={() => handleLinkClick('myorders')}>
                                <h4>Orders</h4>
                            </Link>
                            <h4 onClick={()=>handleLogout(navigate)}>Logout</h4>
                        </div>
                        <div className="u-right">
                            <Routes>
                                <Route path="userinfo" element={<Pi />} />
                                <Route path="addressbook" element={<Adressbook />} />
                                <Route path="myorders" element={<Myorders />} />
                            </Routes>
                        </div>
                    </div>
                </>
            ) : (
                <div className="loginsignup">
                    <div className="box">
                        <h1>{state}</h1>
                        <div className="loginsignup-fields">
                            {state === "Sign Up" ? (
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={changeHandler}
                                    type="text"
                                    placeholder="Your Name"
                                />
                            ) : null}
                            <input
                                name="email"
                                value={formData.email}
                                onChange={changeHandler}
                                type="email"
                                placeholder="Email"
                            />
                            <input
                                name="password"
                                value={formData.password}
                                onChange={changeHandler}
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                        {state === "Sign Up" ? (
                            <div className="loginsignup-agree">
                                <input type="checkbox" />
                                <p>By Continuing, I agree to the Terms and Privacy.</p>
                            </div>
                        ) : null}
                        <button onClick={() => {
                            state === "Login" ? login(formData, navigate) : signup(formData, navigate);
                        }}>
                            Continue
                        </button>
                        {state === "Sign Up" ? (
                            <p className="login-signup">
                                Already have an Account? 
                                <span onClick={() => setState("Login")}>Login here</span>
                            </p>
                        ) : null}
                        {state === "Login" ? (
                            <p className="login-signup">
                                Create an Account? 
                                <span onClick={() => setState("Sign Up")}>Sign Up</span>
                            </p>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
