import React, { useState, useEffect } from 'react';
import './css/common.css';
import './css/page.css';
import { Sidebar } from './components/Sidebar';

export const Page = ({ children }) => {
  const [user, setUser] = useState({});

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
    <main className='d-flex flex-nowrap'>
      <Sidebar isAdmin={user.isAdmin} />
      <div className='b-example-vr bg-main flex-grow-1 p-5'>{children}</div>
    </main>
  );
};
