import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import Table from 'react-bootstrap/Table';
import { apiRequest } from '../utils/apiRequest';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }
    await apiRequest
      .get(`/users?${urlSearchParams.toString()}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page>
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
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Mother's Name</th>
            <th>Father's Name</th>
            <th>Spouse's Name</th>
            <th># of Children</th>
            <th>Messenger</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item, index) => (
            <tr key={index}>
              <td>
                <a href={`survey/${item.id}/response`}>{item.id}</a>
              </td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.course}</td>
              <td>{item.address}</td>
              <td>{item.contact}</td>
              <td>{item.mother}</td>
              <td>{item.father}</td>
              <td>{item.spouse}</td>
              <td>{item.children}</td>
              <td>{item.messenger}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  );
};
