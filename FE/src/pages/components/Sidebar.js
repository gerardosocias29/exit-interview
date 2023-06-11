import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/apiRequest';
import Collapse from 'react-bootstrap/Collapse';

export const Sidebar = ({ isAdmin }) => {
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState([]);

  const logout = async () => {
    await apiRequest.post('logout', {}).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    });
  };
  const fetchData = async () => {
    await apiRequest
      .get(`/course`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        className={`d-flex flex-column flex-shrink-0 p-3 text-white text-center bg-primary-indigo sidebar`}
        style={{ width: '320px' }}
      >
        <a href='/' className='text-white text-decoration-none'>
          <span className='fs-5'>EXTERVIEW | {isAdmin ? 'ADMIN' : 'STUDENT'}</span>
        </a>
        <hr />
        <ul className='nav nav-pills flex-column text-start'>
          {isAdmin ? (
            <>
              <li onClick={() => setOpen(!open)}>
                <a className='nav-link text-white' style={{ cursor: 'pointer' }}>
                  Dashboard
                </a>
                <Collapse in={open}>
                  <ul>
                    <li>
                      <a href='/admin/dashboard/all' className='nav-link text-white'>
                        ALL
                      </a>
                    </li>
                    {course.map((c, index) => (
                      <li>
                        <a
                          href={`/admin/dashboard/${c.name.toLowerCase()}`}
                          className='nav-link text-white'
                        >
                          {c.name.toUpperCase()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </li>
            </>
          ) : null}
          <li>
            <a href='/forms' className='nav-link text-white'>
              Forms
            </a>
          </li>
          {isAdmin ? (
            <li>
              <a href='/users' className='nav-link text-white'>
                Respondents
              </a>
            </li>
          ) : null}
          {isAdmin ? (
            <li>
              <a href='/course' className='nav-link text-white'>
                Course
              </a>
            </li>
          ) : null}
          <li>
            <a href='/profile' className='nav-link text-white'>
              Profile
            </a>
          </li>
          <li>
            <a href='/' className='nav-link text-white' onClick={logout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};
