import React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import { CiShoppingCart, CiBoxList } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineVerified } from "react-icons/md";
import { LiaUserSolid } from "react-icons/lia";



const Sidebar = () => {
  return (
    <div className="sidebar">
        <Link to="/admin" style={{ textDecoration: 'none' }} aria-label="Product List">
        <div className="sidebar_item">
          <LuLayoutDashboard />
          <p>Dashboard</p>
        </div>
      </Link>
      <Link to="addproduct" style={{ textDecoration: 'none' }} aria-label="Add Product">
        <div className="sidebar_item">
          <CiShoppingCart />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to="productlist" style={{ textDecoration: 'none' }} aria-label="Product List">
        <div className="sidebar_item">
          <CiBoxList />
          <p>Product List</p>
        </div>
      </Link>
      <Link to="orders" style={{ textDecoration: 'none' }} aria-label="Product List">
        <div className="sidebar_item">
          <MdOutlineVerified/>
          <p>Orders</p>
        </div>
      </Link>
      <Link to="users" style={{ textDecoration: 'none' }} aria-label="Product List">
        <div className="sidebar_item">
          <LiaUserSolid/>
          <p>Users</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
