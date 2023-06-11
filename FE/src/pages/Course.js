import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import Table from 'react-bootstrap/Table';
import { apiRequest } from '../utils/apiRequest';
import { Button, Modal } from 'react-bootstrap';

export const Course = () => {
  const [course, setCourse] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [cr, setCr] = useState({
    name: null,
  });
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = (id) => {
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await apiRequest
      .post(`/course/create`, cr)
      .then((res) => {
        handleClose();
        fetchData();
        setCr({
          name: null,
        });
      })
      .catch((e) => {
        alert(e.response.data);
      });
  };

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    if (keyword !== '') {
      urlSearchParams.append('keyword', keyword);
    }
    await apiRequest
      .get(`/course?${urlSearchParams.toString()}`)
      .then((res) => {
        setCourse(res.data);
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
      <div className='d-flex justify-content-end ms-auto mb-3'>
        <button className='btn btn-primary' onClick={() => handleShow(true)}>
          + Add Course
        </button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {course.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>Add Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                required
                onChange={(e) => setCr({ ...cr, name: e.target.value })}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='primary' type='submit'>
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Page>
  );
};
