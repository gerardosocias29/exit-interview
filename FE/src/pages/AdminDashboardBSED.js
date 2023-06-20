import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Container, Row, Col, Stack } from 'react-bootstrap';
import { DateTime } from 'luxon';
import { apiRequest } from '../utils/apiRequest';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export const AdminDashboardBSED = () => {
  const [dashboard, setDashboard] = useState([]);

  const fetchData = async () => {
    await apiRequest
      .get(`/answer?course=BSED`)
      .then((res) => {
        setDashboard(res.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getOptions = (name, isStacked = false, isHorizontal = false) => {
    return {
      responsive: true,
      plugins: {
        legend: true,
        title: {
          display: true,
          text: name,
        },
      },
      ...(isStacked && {
        scales: {
          y: {
            stacked: true,
          },
          x: {
            stacked: true,
          },
        },
      }),
      ...(isHorizontal && {
        indexAxis: 'y',
      }),
    };
  };

  const labels0 = ['January', 'February', 'March', 'April'];

  const data0 = {
    labels: labels0,
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 0, 10, 38],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Dataset 2',
        data: [10, 5, 0, 48],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Dataset 3',
        data: [0, 59, 19, 108],
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
  };

  const pieData = {
    labels: ['BSIT', 'BSHM', 'Crim', 'Educ'],
    datasets: [
      {
        label: '# of Responses',
        data: [29, 19, 15, 32],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(225, 216, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(225, 216, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: true,
      title: {
        display: true,
        text: 'RESPONSE BY COURSE',
      },
    },
    maintainAspectRatio: false,
  };

  const faculty_and_instructions = {
    labels: dashboard.faculty_and_instructions ? dashboard.faculty_and_instructions[0].labels : [],
    datasets: [
      {
        label: 'Most Liked',
        data: dashboard.faculty_and_instructions
          ? dashboard.faculty_and_instructions[0].values
          : [],
        backgroundColor: 'rgba(143, 227, 164, 15)',
      },
      {
        label: 'Least Liked',
        data: dashboard.faculty_and_instructions
          ? dashboard.faculty_and_instructions[1].values
          : [],
        backgroundColor: 'rgba(215, 99, 132, 75)',
      },
    ],
  };

  const subjects = {
    labels: dashboard.subjects ? dashboard.subjects[0].labels : [],
    datasets: [
      {
        label: 'Most Liked',
        data: dashboard.subjects ? dashboard.subjects[0].values : [],
        backgroundColor: 'rgba(143, 227, 164, 15)',
      },
      {
        label: 'Least Liked',
        data: dashboard.subjects ? dashboard.subjects[1].values : [],
        backgroundColor: 'rgba(215, 99, 132, 75)',
      },
    ],
  };

  const getData = (arr, i) => {
    return arr.map((item) => item[i]);
  };

  const getDatasets = (category) => {
    return {
      labels: dashboard[category] ? dashboard[category][0].labels : [],
      datasets: [
        {
          label: '1',
          data: dashboard[category] ? getData(dashboard[category][0].values, '1') : [],
          backgroundColor: 'rgba(201, 48, 74, 15)',
        },
        {
          label: '2',
          data: dashboard[category] ? getData(dashboard[category][0].values, '2') : [],
          backgroundColor: 'rgba(222, 132, 29, 15)',
        },
        {
          label: '3',
          data: dashboard[category] ? getData(dashboard[category][0].values, '3') : [],
          backgroundColor: 'rgba(245, 224, 42, 15)',
        },
        {
          label: '4',
          data: dashboard[category] ? getData(dashboard[category][0].values, '4') : [],
          backgroundColor: 'rgba(178, 232, 128, 15)',
        },
        {
          label: '5',
          data: dashboard[category] ? getData(dashboard[category][0].values, '5') : [],
          backgroundColor: 'rgba(58, 201, 70, 15)',
        },
      ],
    };
  };

  return (
    <Page>
      <Container className='mb-3'>
        <Stack
          direction='horizontal'
          gap={3}
          className='p-3'
          style={{ backgroundColor: '#a7a6ae' }}
        >
          <div className='d-flex justify-items-end'>
            <img
              style={{ width: '80px' }}
              alt=''
              src='https://simg.nicepng.com/png/small/246-2467547_your-logo-here-your-logo-here-logo-png.png'
            />
          </div>
          <div>
            <h4>Exit Interview Data</h4>
            <h6>{DateTime.now().toFormat('MMMM dd, yyyy')}</h6>
          </div>
          <div className='ms-5'>
            <h6>Counseling and Testing Office</h6>
            <h6>College and Information Technology Education</h6>
            <h6>Gathered Data Information Exit Interview</h6>
          </div>
          <div className='d-flex justify-items-end ms-auto'>
            <a href='/download' target='_blank'>
              <button className='btn btn-success'>Generate Data Here</button>
            </a>
          </div>
        </Stack>
      </Container>
      <Container>
        <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Pie data={pieData} options={optionsPie} width={'50%'} />
          </Col>
          <Col>
            <Bar options={getOptions('FACULTY AND INSTRUCTORS')} data={faculty_and_instructions} />
          </Col>
        </Row>

        <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Bar options={getOptions('SUBJECTS')} data={subjects} />
          </Col>
          <Col>
            <Bar
              options={getOptions('STUDENT SERVICES', true, true)}
              data={getDatasets('student_services')}
            />
          </Col>
        </Row>
        <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Bar
              options={getOptions('SCHOOL PLANT', true, true)}
              data={getDatasets('school_plant')}
            />
          </Col>
          <Col>
            <Bar
              options={getOptions('SCHOOL FACILITIES AND EQUIPMENTS', true, true)}
              data={getDatasets('school_facilities_and_equipments')}
            />
          </Col>
        </Row>

        <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Bar
              options={getOptions('SCHOOL RULES AND POLICIES', true, true)}
              data={getDatasets('school_rules_and_policies')}
            />
          </Col>
          <Col>
            <Bar
              options={getOptions('ADMINISTRATION', true, true)}
              data={getDatasets('administration')}
            />
          </Col>
        </Row>
      </Container>
    </Page>
  );
};
