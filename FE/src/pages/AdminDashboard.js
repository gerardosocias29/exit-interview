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
import { recommendations } from '../utils/dummy';
import { sortFormatData, chartFormatData } from '../utils/sorter';
import { useParams } from 'react-router-dom';

import ApexCharts from 'react-apexcharts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState([]);
  const [reco, setReco] = useState([]);
  const { course } = useParams();

  const [dashboardAnalytics, setDashboardAnalytics] = useState([]);
  const [statistics, setStatistics] = useState([]);

  const fetchData = async () => {
    await apiRequest
      .get(`/answer?course=${course}`)
      .then((res) => {
        setDashboard(res.data || []);
      })
      .catch((error) => {
        console.log(error);
      });

    // await apiRequest
    //   .get(`/dashboard_details`)
    //   .then((res) => {
    //     setDashboardAnalytics(res.data || []);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    await apiRequest
      .get(`/recommendations?course=${course}`)
      .then((res) => {
        // const cat = res.data.filter((item) => item.form === 'student services');
        // const sorted = cat[0].data[0].recommendations.sort((a, b) => b.values - a.values);
        // const topFive = sorted.splice(0, 5);

        const d = res.data.map((item) => {
          if (item.data[0]) {
            let sorted = item.data[0].recommendations.sort((a, b) => b.values - a.values);
            let topFive = sorted.splice(0, 5);

            return {
              title: item.form,
              labels: topFive.map((a) => a.label),
              datasets: [
                {
                  label: 'recommendation',
                  data: topFive.map((a) => a.values),
                  backgroundColor: '#3344ff',
                },
              ],
            };
          }

          return {};
        });

        const r = d.map((item) => item);
        console.log(
          r
            .filter((item) => item.title === 'student services')
            .map((item) => ({ labels: item.labels, datasets: item.datasets }))[0],
        );
        // {
        //   labels: topFive.map((a) => a.label),
        //   datasets: {
        //     label: 'recommendation',
        //     data: topFive.map((a) => a.values),
        //     backgroundColor: '#3344ff',
        //   },
        // };

        setReco(r || {});
      })
      .catch((error) => {
        console.log(error);
      });

    await apiRequest
    .get(`/stats/${course}`)
    .then((res) => {
      setStatistics(res.data.faculty_and_instructors);
      setDashboardAnalytics(res.data.stats);
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
        // tooltip: {
        //   callbacks: {
        //     label: function (context) {
        //       let label = context.dataset.label || '';

        //       if (label) {
        //         label += ': ';
        //       }
        //       if (context.parsed.y !== null) {
        //         label += new Intl.NumberFormat('en-US', {
        //           style: 'currency',
        //           currency: 'USD',
        //         }).format(context.parsed.y);
        //       }
        //       return label;
        //     },
        //   },
        // },
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
        scales: {
          x: {
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
        },
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
    labels: dashboard?.course?.map((item) => item.name) || [],
    datasets: [
      {
        label: '# of Responses',
        data: dashboard?.course?.map((item) => item.students.length),
        backgroundColor: dashboard?.course?.map((item) => {
          if (item.name.toLowerCase() === 'bsit') return 'pink';
          else if (item.name.toLowerCase() === 'bscrim') return 'grey';
          else if (item.name.toLowerCase() === 'bshm') return 'green';
          else if (item.name.toLowerCase() === 'bseduc') return 'blue';
          else if (item.name.toLowerCase() === 'bsed') return 'blue';
          else if (item.name.toLowerCase() === 'beed') return 'blue';
          else return 'black';
        }),
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(225, 216, 86, 1)',
          'rgba(75, 192, 12, 1)',
          'rgba(70, 152, 92, 1)',
          'rgba(11, 22, 52, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const ResponsByCourse = () => {
    var colors = dashboard?.course?.map((item) => {
      if (item.name.toLowerCase() === 'bsit') return 'pink';
      else if (item.name.toLowerCase() === 'bscrim') return 'grey';
      else if (item.name.toLowerCase() === 'bshm') return 'green';
      else if (item.name.toLowerCase() === 'bseduc') return 'blue';
      else if (item.name.toLowerCase() === 'bsed') return 'blue';
      else if (item.name.toLowerCase() === 'beed') return 'blue';
      else return 'black';
    });

    if(colors != null) {

    }
    const options = {
      series: dashboard?.course?.map((item) => item.students.length) || [],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: dashboard?.course?.map((item) => item.name) || [],
      colors: dashboard?.course?.map((item) => {
        if (item.name.toLowerCase() === 'bsit') return '#FFC0CB';
        else if (item.name.toLowerCase() === 'bscrim') return '#808080';
        else if (item.name.toLowerCase() === 'bshm') return '#008000';
        else if (item.name.toLowerCase() === 'bseduc') return '#0000FF';
        else if (item.name.toLowerCase() === 'bsed') return '#0000FF';
        else if (item.name.toLowerCase() === 'beed') return '#0000FF';
        else return '#000000';
      }),
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  
    return (
      <div id="chart">
        <ApexCharts options={options} series={options.series} type={options.chart.type} width={options.chart.width} />
      </div>
    );
  }

  const FacultyAndInstructions = () => {
    var instructors = Object.keys(statistics).map((statistic) => statistic);
    console.log("instructors", instructors);

    var learnTheMost = Object.keys(statistics).map((stat) => statistics[stat].learnMostCount);
    console.log("learnTheMost", learnTheMost);

    var learnTheLeast = Object.keys(statistics).map((stat) => statistics[stat].learnLeastCount);
    console.log("learnTheLeast", learnTheLeast);

    // Calculate total respondents
    var totalRespondents = learnTheMost.reduce((sum, count) => sum + count, 0);

    const options = {
      series: [
        {
          name: 'Learn the Most',
          data: learnTheMost
        },
        {
          name: 'Learn the Least',
          data: learnTheLeast
        }
      ],
      chart: {
        type: 'bar',
        height: 500,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, { seriesIndex, dataPointIndex }) {
          var percentage = ((val / totalRespondents) * 100).toFixed(2);
          return percentage + '%';
        }
      },
      xaxis: {
        categories: instructors
      },
      legend: {
        position: 'top'
      },
      tooltip: {
        y: {
          formatter: function (val, { seriesIndex, dataPointIndex }) {
            return val + " (" + ((val / totalRespondents) * 100).toFixed(2) + "%)";
          }
        }
      }
    };

    return (
      <div>
        <ApexCharts options={options} series={options.series} type={options.chart.type} height={options.chart.height} />
        {instructors.map((instructor, index) => (
          <div key={index} className="card my-2">
            <div className="card-body">
              <h5 className="card-title p-0">{instructor}</h5>
              <p className="card-text">{statistics[instructor].topRecommendation}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const FormResponses = () => {
    var noOfRespondents = Object.keys(dashboardAnalytics).map((key, index) => {
      const noOfRespondents = Object.values(dashboardAnalytics[key])[0].no_of_respondents;
      return noOfRespondents;
    });
    
    var formNames = dashboardAnalytics.map(item => {
      var key = Object.keys(item)[0];
      var formattedName = key.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      return item[key].form_course + '-' + formattedName;
    });

    console.log(dashboardAnalytics);
    const options = {
      series: [
        {
          name: 'No. of Respondents',
          data: noOfRespondents
        }
      ],
      chart: {
        type: 'bar',
        height: 500
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toString();
        }
      },
      xaxis: {
        categories: formNames
      },
      legend: {
        position: 'top',
        show: true,
        markers: {
          fillColors: ['#008FFB']
        },
        labels: {
          colors: ['#000000'],
          useSeriesColors: false,
          formatter: function (val) {
            return val;
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString();
          }
        }
      }
    };
    
    
    
  
    return <ApexCharts options={options} series={options.series} type={options.chart.type} height={options.chart.height} />;
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: true,
      title: {
        display: true,
        text: 'RESPONSE BY COURSE',
      },
      // tooltip: {
      //   callbacks: {
      //     // labelTextColor: function (context) {
      //     //   return '#543453';
      //     // },
      //     label: function (tooltipItem, data) {
      //       const dataset = data.datasets[tooltipItem.datasetIndex];
      //       const total = dataset.data.reduce(
      //         (previousValue, currentValue) => previousValue + currentValue,
      //       );
      //       const currentValue = dataset.data[tooltipItem.index];
      //       const percentage = ((currentValue / total) * 100).toFixed(2);
      //       return `${data.labels[tooltipItem.index]}: ${percentage}%`;
      //     },
      //   },
      // },
    },
    maintainAspectRatio: false,
  };

  const faculty_and_instructions = {
    labels: dashboard.faculty_and_instructions ? dashboard.faculty_and_instructions[0]?.labels : [],
    datasets: [
      {
        label: 'Most Liked',
        data: dashboard.faculty_and_instructions
          ? dashboard.faculty_and_instructions[0]?.values
          : [],
        backgroundColor: 'rgba(143, 227, 164, 15)',
      },
      {
        label: 'Least Liked',
        data: dashboard.faculty_and_instructions
          ? dashboard.faculty_and_instructions[1]?.values
          : [],
        backgroundColor: 'rgba(215, 99, 132, 75)',
      },
    ],
  };

  const subjects = {
    labels: dashboard.subjects ? dashboard.subjects[0]?.labels : [],
    datasets: [
      {
        label: 'Most Liked',
        data: dashboard.subjects ? dashboard.subjects[0]?.values : [],
        backgroundColor: 'rgba(143, 227, 164, 15)',
      },
      {
        label: 'Least Liked',
        data: dashboard.subjects ? dashboard.subjects[1]?.values : [],
        backgroundColor: 'rgba(215, 99, 132, 75)',
      },
    ],
  };

  const getData = (arr, i) => {
    return arr.map((item) => item[i]);
  };

  const getDatasets = (category) => {
    return {
      labels: dashboard[category] ? dashboard[category][0]?.labels : [],
      datasets: [
        {
          label: '1',
          data: dashboard[category] ? getData(dashboard[category][0]?.values, 'poor') : [],
          backgroundColor: 'rgba(201, 48, 74, 15)',
        },
        {
          label: '2',
          data: dashboard[category] ? getData(dashboard[category][0]?.values, 'unsatisfied') : [],
          backgroundColor: 'rgba(222, 132, 29, 15)',
        },
        {
          label: '3',
          data: dashboard[category] ? getData(dashboard[category][0]?.values, 'satisfied') : [],
          backgroundColor: 'rgba(245, 224, 42, 15)',
        },
        {
          label: '4',
          data: dashboard[category] ? getData(dashboard[category][0]?.values, 'good') : [],
          backgroundColor: 'rgba(178, 232, 128, 15)',
        },
        {
          label: '5',
          data: dashboard[category] ? getData(dashboard[category][0]?.values, 'very good') : [],
          backgroundColor: 'rgba(58, 201, 70, 15)',
        },
      ],
    };
  };

  const getCourse = () => {
    switch (course) {
      case 'bsit':
        return 'Information Technology';
      case 'bscrim':
        return 'Criminal Justice';
      case 'bshm':
        return 'Hotel Management';
      case 'beed':
        return 'Education';
      case 'bsed-english':
        return 'Education Major in English';
      case 'bsed-math':
        return 'Education Major in Math';
      default:
        return 'All Courses';
    }
  };

  return (
    <Page>
      <div className='mb-3'>
        <Stack
          direction='horizontal'
          gap={3}
          className='p-3'
          style={{ backgroundColor: '#a7a6ae' }}
        >
          <div className='d-flex justify-items-end'>
            <img style={{ width: '80px' }} alt='' src='/bcc.jpeg' />
          </div>
          <div>
            <h4>Exit Interview Data</h4>
            <h6>{DateTime.now().toFormat('MMMM dd, yyyy')}</h6>
          </div>
          <div className='ms-5'>
            <h6>Counseling and Testing Office</h6>
            <h6>College of {getCourse()}</h6>
            <h6>Gathered Data Information Exit Interview</h6>
          </div>
          <div className='d-flex justify-items-end ms-auto'>
            <a href={`/download/${course}`} target='_blank'>
              <button className='btn btn-success'>Generate Data Here</button>
            </a>
          </div>
        </Stack>
      </div>
      <div>
        {course !== 'all' ? (
          <>
            {/* <Row className='mb-3 py-2 border-bottom'>
              <Col>
                <Bar
                  options={getOptions('FACULTY AND INSTRUCTORS')}
                  data={faculty_and_instructions}
                />
              </Col>
              <Col>
                <Bar
                  options={getOptions('TOP RECOMMENDATIONS', false, true)}
                  data={recommendations.faculty}
                />
              </Col>
            </Row>

            <Row className='mb-3 py-2 border-bottom'>
              <Col>
                <Bar options={getOptions('SUBJECTS')} data={subjects} />
              </Col>
              <Col>
                <Bar
                  options={getOptions('TOP RECOMMENDATIONS', false, true)}
                  data={recommendations.subject}
                />
              </Col>
            </Row> */}
          </>
        ) : (

          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Response By Course</h5>
                {ResponsByCourse()}
              </div>
            </div>
          </div>
          // <Row classNameName='mb-3 py-2 border-bottom'>
          //   <Col>
          //     <Pie data={pieData} options={optionsPie} width={'100%'} />
          //   </Col>
          // </Row>
        )}
        

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Faculty And Instructors</h5>
              {FacultyAndInstructions()}
            </div>
          </div>
        </div>

        {course === "all" && (
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Form Responses</h5>
                {FormResponses()}
              </div>
            </div>
          </div>
        )}

        {/* {
          Object.keys(dashboardAnalytics).map((data, index) => (
            console.log(dashboardAnalytics[data]),
            <Row className='mb-3 py-2 border-bottom'>
              
              <Col>
                <Bar
                  options={getOptions(data.replace('_', ' ').toUpperCase(), false, true)}
                  data={dashboardAnalytics[data]}
                />
              </Col>
            </Row>
          ))
        } */}

        

        {/* <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Bar
              options={getOptions('SCHOOL PLANT', true, true)}
              data={getDatasets('school_plant')}
            />
          </Col>
          <Col>
            <Bar
              options={getOptions('TOP RECOMMENDATIONS', true, true)}
              data={
                reco
                  .filter((item) => item.title === 'student plant')
                  .map((item) => ({ labels: item.labels, datasets: item.datasets }))[0] ||
                recommendations.student_plant
              }
            />
          </Col>
        </Row>

        <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Bar
              options={getOptions('SCHOOL FACILITIES AND EQUIPMENTS', true, true)}
              data={getDatasets('school_facilities_and_equipments')}
            />
          </Col>
          <Col>
            <Bar
              options={getOptions('TOP RECOMMENDATIONS', true, true)}
              data={
                reco
                  .filter((item) => item.title === 'school facilities and equipments')
                  .map((item) => ({ labels: item.labels, datasets: item.datasets }))[0] ||
                recommendations.equipments
              }
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
              options={getOptions('TOP RECOMMENDATIONS', true, true)}
              data={
                reco
                  .filter((item) => item.title === 'school rules and policies')
                  .map((item) => ({ labels: item.labels, datasets: item.datasets }))[0] ||
                recommendations.policies
              }
            />
          </Col>
        </Row>
        <Row className='mb-3 py-2 border-bottom'>
          <Col>
            <Bar
              options={getOptions('ADMINISTRATION', true, true)}
              data={getDatasets('administration')}
            />
          </Col>
          <Col>
            <Bar
              options={getOptions('ADMINISTRATION', true, true)}
              data={
                reco
                  .filter((item) => item.title === 'administration')
                  .map((item) => ({ labels: item.labels, datasets: item.datasets }))[0] ||
                recommendations.admin
              }
            />
          </Col>
        </Row> */}


      </div>
    </Page>
  );
};
