// Sidebar.js
import React from 'react';
import { FaHome, FaUser, FaUsers, FaCalendarAlt, FaFileAlt, FaChartLine, FaCog, FaSignOutAlt, FaRobot } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><FaHome /> HOME</li>
          <li><FaUser /> PROFILE</li>
          <li><FaUsers /> MENTORS</li>
          <li><FaCalendarAlt /> BOOKING</li>
          <li><FaFileAlt /> REGISTER</li>
          <li><FaChartLine /> REPORT</li>
          <li className="active"><FaRobot /> USE AI</li>
          <li><FaCog /> SETTINGS</li>
          <li><FaSignOutAlt /> LOGOUT</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
