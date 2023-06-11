import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import Card from 'react-bootstrap/Card';
import { apiRequest } from '../utils/apiRequest';

export const Thanks = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    await apiRequest
      .get(`/users`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='min-vh-100 d-flex justify-content-center p-5 bg-main-student'>
      <div className='card border-0 w-50 h-50'>
        <div className='card-body p-5 text-center'>
          <h3>Thank you for completing the survey.</h3>
          <h5>Have a nice day ahead!</h5>
        </div>
      </div>
    </div>
  );
};
