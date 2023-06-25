import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import Table from 'react-bootstrap/Table';
import { apiRequest } from '../utils/apiRequest';
import { Button, Modal, Tooltip } from 'react-bootstrap';

export const Course = () => {
  const [course, setCourse] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [cr, setCr] = useState({
    name: null,
    no_of_students: 0
  });
  const [editCourse, setEditCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = (id) => {
    setShowModal(true);
    setIsUpdate(false);
  };

  const handleRowClick = (data) => {
    setIsUpdate(true);
    setShowModal(true);
    setEditCourse(data);
    console.log(data);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if(isUpdate){
      await apiRequest.post(`/course/update`, editCourse)
      .then((res) => {
        handleClose();
        fetchData();
        setEditCourse([]);
      })
      .catch((e) => {
        alert(e.response.data);
      });
    } else {
      await apiRequest
        .post(`/course/create`, cr)
        .then((res) => {
          handleClose();
          fetchData();
          setCr({
            name: null,
            no_of_students: 0,
          });
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
    
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
            <th>No. of Students</th>
          </tr>
        </thead>
        <tbody>
          {course.map((item, index) => (
            <tr onClick={() => handleRowClick(item)}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.no_of_students}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={onSubmit}>
          <Modal.Header className='bg-primary text-white'>
            <Modal.Title>{ isUpdate ? 'Update Course' : 'Add Course'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              
              {
                !isUpdate && (
                  <>
                    <label className='mt-3'>Course Name:</label>
                    <input
                      type='text'
                      className='form-control'
                      required
                      onChange={(e) => setCr({ ...cr, name: e.target.value })}
                    />
                    <label className='mt-3'>No. Of Students</label>
                    <input
                      type='text'
                      className='form-control'
                      required
                      onChange={(e) => setCr({ ...cr, no_of_students: e.target.value })}
                    />
                  </>
                )
              }

              {
                isUpdate && (
                  <>
                    <label className='mt-3'>Course Name:</label>
                    <input
                      type='text'
                      className='form-control'
                      required
                      value={editCourse.name}
                      onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
                    />
                    <label className='mt-3'>No. Of Students</label>
                    <input
                      type='text'
                      className='form-control'
                      required
                      value={editCourse.no_of_students}
                      onChange={(e) => setEditCourse({ ...editCourse, no_of_students: e.target.value })}
                    />
                  </>
                )
              }
              
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
