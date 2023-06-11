import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';

export const Form = () => {
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState({});
  const [keyword, setKeyword] = useState('');

  const fetchUserData = async () => {
    setUser(JSON.parse(localStorage.getItem('user') || {}));
  };

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }
    await apiRequest
      .get(`/form?${urlSearchParams.toString()}`)
      .then((res) => {
        setForms(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  const deleteData = async (id) => {
    await apiRequest
      .delete(`/form/${id}`)
      .then((res) => {
        alert('successfully deleted');
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserData();
    fetchData();
  }, []);

  return (
    <Page>
      <div className='d-flex justify-content-between mb-3'>
        <div className='w-75'>
          <form className='d-flex me-2' onSubmit={submitFilter}>
            <input
              type='text'
              className='form-control'
              placeholder='search'
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
            <button className='btn btn-primary' type='submit'>
              Search
            </button>
          </form>
        </div>
        {user.isAdmin ? (
          <div className=''>
            <a href='/form/add'>
              <button className='btn btn-primary'>+ Add Forms</button>
            </a>
          </div>
        ) : null}
      </div>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Course</th>
            <th scope='col' colSpan='2'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {forms.length > 0 ? (
            forms.map((key, index) => (
              <tr key={index}>
                <th scope='row'>{key.id}</th>
                <td>
                  <a href={`/survey/${key.id}/responses`}>{key.name}</a>
                </td>
                <td>{key.form_course || '-'}</td>
                <td className='d-flex'>
                  {user.isAdmin ? (
                    <>
                      <a href={`/form/${key.id}/update`}>
                        <button className='btn btn-success btn-sm px-4 mx-2'>Update</button>
                      </a>
                      <button
                        className='btn btn-danger btn-sm px-4 mx-2'
                        onClick={() => deleteData(key.id)}
                        disabled={key.responses && key.responses.length > 0}
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                  {!user.isAdmin && (
                    <a href={`/survey/${key.id}`}>
                      <button className='btn btn-warning btn-sm px-4 mx-2'>Submit Response</button>
                    </a>
                  )}
                </td>
                <td />
              </tr>
            ))
          ) : (
            <tr className='text-center'>
              <td colSpan='4'>No Form/s yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Page>
  );
};
