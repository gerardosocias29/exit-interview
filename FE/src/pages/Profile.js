import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { Image, Card } from 'react-bootstrap';

export const Profile = () => {
  const [user, setUser] = useState({});
  const [isUpdating, setUpdating] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest.post('/update', user).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setUpdating(false);
    });
  };

  return (
    <Page>
      <center className='mb-4'>
        <Image
          src='https://newprofilepic2.photo-cdn.net//assets/images/article/profile.jpg'
          alt=''
          roundedCircle
          style={{ width: '100px' }}
        />
      </center>

      {isUpdating ? (
        <Card className='p-3'>
          <form onSubmit={onSubmit}>
            <h5 className='card-title text-center my-2'>Update Admin Profile</h5>
            <div className='mb-3'>
              <h6>Name</h6>
              <input
                type='text'
                className='form-control'
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <h6>Contact</h6>
              <input
                type='text'
                className='form-control'
                maxLength='11'
                pattern='^[0-9,]*$'
                value={user.contact}
                onChange={(e) => setUser({ ...user, contact: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Address</h6>
              <textarea
                className='form-control'
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Birthdate</h6>
              <input
                type='date'
                className='form-control'
                value={user.birthdate}
                onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                required
              />
            </div>
            <div className='mb-3'>
              <h6>Messenger</h6>
              <input
                type='text'
                className='form-control'
                value={user.messenger}
                onChange={(e) => setUser({ ...user, messenger: e.target.value })}
              />
            </div>
            <div className='d-flex justify-content-end ms-auto mb-3'>
              <button type='button' className='btn btn-danger me-2'>
                Cancel
              </button>
              <button type='submit' className='btn btn-success'>
                Save Changes
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          <div className='d-flex justify-content-end ms-auto mb-3'>
            <button className='btn btn-primary' onClick={() => setUpdating(true)}>
              Edit
            </button>
          </div>
          <Card className='p-3'>
            <p className='border p-2'>ID: {user.id}</p>
            <p className='border p-2'>Name: {user.name || '-'} </p>
            <p className='border p-2'>Email: {user.email || '-'} </p>
            <p className='border p-2'>Address: {user.address || '-'} </p>
            <p className='border p-2'>Contact: {user.contact || '-'} </p>
            <p className='border p-2'>Messenger: {user.messenger || '-'} </p>
          </Card>
        </>
      )}
    </Page>
  );
};
