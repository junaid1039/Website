import React from 'react';
import './adminnavbar.css';
import { TbChartHistogram } from "react-icons/tb";
import { LuLogIn } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    sessionStorage.removeItem('auth-token'); // Remove token from sessionStorage
    navigate('/account'); // Redirect to the login page
  };

  return (
    <div className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-left">
          <h1><TbChartHistogram /> Admin Panel</h1>
        </div>
        <div className="admin-navbar-right">
          <div className="admin-logout-button" onClick={handleLogout}>
            <LuLogIn /> Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
