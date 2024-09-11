// App.js
import React, { useState } from 'react';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import InnerContent from './components/InnerContent';
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="content-wrapper">
        <Sidebar isOpen={sidebarOpen} />
      </div>
      <div className='content'>
          <InnerContent />
      </div>
    </div>
  );
};

export default App;
