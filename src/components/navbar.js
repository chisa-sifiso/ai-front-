import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <img src='./assets/TUT_Logo_Transparent.png'></img>

      <div className='nameTag'>
        <img src='./assets/face.png'></img>
        <h3>A Baleni</h3>
      </div>
    </nav>
  );
};

export default Navbar;