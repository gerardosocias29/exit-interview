import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';

export const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post('/login', {
        email: user.email,
        password: user.password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.isAdmin) {
          window.location.href = '/admin/dashboard/all';
        } else {
          window.location.href = '/forms';
        }
      });
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center py-5 bg-main-student'>
      <div className='card w-25 border-0'>
        <div className='card-header p-0'>
          <img src='/login.jpeg' className='card-img-top' alt='' />
        </div>
        <div className='card-body'>
          <form onSubmit={onSubmit}>
            <h5 className='card-title text-center my-2'>Login</h5>
            <div className='mb-3'>
              <h6>Email</h6>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Password</h6>
              <input
                type='password'
                className='form-control'
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <button type='submit' className='btn btn-primary'>
              Login
            </button>
          </form>
          <hr />
          <div className='text-center'>
            <a href='/register'>No account yet? Register here</a>
            <br />
            <a href='/privacy-policy'>Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
