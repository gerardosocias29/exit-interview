import React, { useState, useEffect } from 'react';
import './css/common.css';
import './css/page.css';
import { Sidebar } from './components/Sidebar';

export const Page = ({ children }) => {
  const [user, setUser] = useState({});
  const [sideOpen, setSideOpen] = useState(true);

  const handleClick = () => {
    setSideOpen(!sideOpen);
    console.log(sideOpen);
  }


  const fetchData = async () => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/';
    } else {
      setUser(JSON.parse(localStorage.getItem('user') || {}));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
          <a href="/admin/dashboard" className="logo d-flex align-items-center ">
            
            <span className="d-none d-lg-block">Exterview | Admin</span>
          </a>
          <svg onClick={() => handleClick()} className='toggle-sidebar-btn' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </div>
      </header>
      <Sidebar isAdmin={user.isAdmin} sideOpen={sideOpen} />
      <main id="main" class="main" style={{ marginLeft: (sideOpen) ? '300px' : '0px' }}>
        {children}
      </main>
      {/* <main className='d-flex flex-nowrap'>
        
        
        <div className='b-example-vr bg-main flex-grow-1 p-5'>{children}</div>
      </main> */}
    </>
  );
};
