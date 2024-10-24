import React from 'react';
import './adminnavbar.css';
import { TbChartHistogram } from "react-icons/tb";
import { LuLogIn } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('auth-token');
    navigate('/account');
  };

  return (
    <div className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-left">
          <h1><TbChartHistogram className="navbar-icon" /> Admin Panel</h1>
        </div>
        <div className="admin-navbar-right">
          <div className="admin-logout-button" onClick={handleLogout}>
            <LuLogIn className="navbar-icon" /> Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
