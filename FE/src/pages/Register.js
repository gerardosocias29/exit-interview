import React, { useState } from 'react';
import { apiRequest } from '../utils/apiRequest';

export const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPass: '',
    course: '',
    birthdate: '',
    contact: '',
    address: '',
    mother: '',
    father: '',
    spouse: '',
    children: '',
    messenger: '',
  });

  const options = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCRIM', label: 'BSCRIM' },
    { value: 'BSHM', label: 'BSHM' },
    { value: 'BEED', label: 'BEED' },
    { value: 'BSED-ENGLISH', label: 'BSED-ENGLISH' },
    { value: 'BSED-MATH', label: 'BSED-MATH' },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();

    if (user.password === user.confirmPass) {
      await apiRequest.post('/register', user).then((res) => {
        alert('Successfully Registered');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.isAdmin) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/forms';
        }
      });
    } else {
      alert('Password does not matched');
    }
  };

  return (
    <div className='min-vh-100 d-flex justify-content-center p-5 bg-main-student'>
      <div className='card border-0 w-75'>
        <div className='card-body'>
          <h4>Personal Information</h4>
          <br />
          <form onSubmit={onSubmit}>
            <div className='mb-3'>
              <h6>Name</h6>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Course</h6>
              <select
                className='form-control'
                name='instructors'
                onChange={(e) => setUser({ ...user, course: e.target.value })}
                required
              >
                <option value={null}>Select a Course</option>
                {options.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <h6>Email</h6>
              <input
                type='email'
                className='form-control'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Contact</h6>
              <input
                type='text'
                className='form-control'
                maxLength='11'
                pattern='^[0-9,]*$'
                onChange={(e) => setUser({ ...user, contact: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Address</h6>
              <textarea
                className='form-control'
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Birthdate</h6>
              <input
                type='date'
                className='form-control'
                onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                required
              />
            </div>
            <hr />
            <button type='submit' className='btn btn-primary'>
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
