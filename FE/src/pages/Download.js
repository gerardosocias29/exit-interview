import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { recommendations } from '../utils/dummy';

export const Download = () => {
  const [dashboard, setDashboard] = useState([]);
  const exportRef = useRef();

  const fetchData = async () => {
    await apiRequest
      .get(`/answer`)
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

  const generatePDF = async () => {
    html2canvas(exportRef.current).then((canvas) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      heightLeft -= pageHeight;
      const doc = new jsPDF('p', 'mm');
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save(`survey.pdf`);
    });
  };

  return (
    <div className='p-3 text-center'>
      <button className='btn btn-primary float-right' onClick={generatePDF}>
        Download Report
      </button>
      <div
        ref={exportRef}
        className='text-center my-2 mx-5'
        style={{ padding: '40px 160px', backgroundColor: '#f2f2f3' }}
      >
        <h4>Republic Of the Philippines</h4>
        <h5>Province of Bohol</h5>
        <h5>BUENAVISTA COMMUNITY COLLEGE</h5>
        <h5>Cangawa, Buenavista, Bohol</h5>
        <br />
        <h5 className='text-start'>FACULTY AND INSTRUCTIONS</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>Learn the Most</th>
            <th>Learn the Least</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.faculty_and_instructions ? (
            dashboard.faculty_and_instructions[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start'>{key}</td>
                <td>{dashboard.faculty_and_instructions[0].values[index]}</td>
                <td>{dashboard.faculty_and_instructions[1].values[index]}</td>
                <td>
                  {index % 2 === 0
                    ? recommendations.faculty?.labels[1]
                    : recommendations.faculty?.labels[4]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
        <h5 className='text-start'>SUBJECTS</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>Learn the Most</th>
            <th>Learn the Least</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.subjects ? (
            dashboard.subjects[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start border border-dark'>{key}</td>
                <td>{dashboard.subjects[0].values[index]}</td>
                <td>{dashboard.subjects[1].values[index]}</td>
                <td>
                  {index % 2 === 0
                    ? recommendations.subject?.labels[1]
                    : recommendations.subject?.labels[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
        <h5 className='text-start'>STUDENT SERVICES</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>1 - Very Poor</th>
            <th>2 - Poor</th>
            <th>3 - Satisfactory</th>
            <th>4 - Good</th>
            <th>5 - Excellent</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.student_services ? (
            dashboard.student_services[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start border border-dark'>{key}</td>
                <td>{dashboard.student_services[0].values[index]['poor'] || 0}</td>
                <td>{dashboard.student_services[0].values[index]['unsatisfactory'] || 0}</td>
                <td>{dashboard.student_services[0].values[index]['satisfactory'] || 0}</td>
                <td>{dashboard.student_services[0].values[index]['good'] || 0}</td>
                <td>{dashboard.student_services[0].values[index]['very good'] || 0}</td>
                <td>
                  {index % 2 === 0
                    ? recommendations.student_services?.labels[1]
                    : recommendations.student_services?.labels[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
        <h5 className='text-start'>SCHOOL PLANT</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>1 - Very Poor</th>
            <th>2 - Poor</th>
            <th>3 - Satisfactory</th>
            <th>4 - Good</th>
            <th>5 - Excellent</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.school_plant ? (
            dashboard.school_plant[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start border border-dark'>{key}</td>
                <td className='border border-dark'>
                  {dashboard.school_plant[0].values[index]['poor'] || 0}
                </td>
                <td className='border border-dark'>
                  {dashboard.school_plant[0].values[index]['unsatisfactory'] || 0}
                </td>
                <td className='border border-dark'>
                  {dashboard.school_plant[0].values[index]['satisfactory'] || 0}
                </td>
                <td className='border border-dark'>
                  {dashboard.school_plant[0].values[index]['good'] || 0}
                </td>
                <td className='border border-dark'>
                  {dashboard.school_plant[0].values[index]['very good'] || 0}
                </td>
                <td>
                  {index % 2 === 0
                    ? recommendations.student_plant?.labels[1]
                    : recommendations.student_plant?.labels[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
        <h5 className='text-start'>SCHOOL FACILITIES AND EQUIPMENTS</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>1 - Very Poor</th>
            <th>2 - Poor</th>
            <th>3 - Satisfactory</th>
            <th>4 - Good</th>
            <th>5 - Excellent</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.school_facilities_and_equipments ? (
            dashboard.school_facilities_and_equipments[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start border border-dark'>{key}</td>
                <td>{dashboard.school_facilities_and_equipments[0].values[index]['poor'] || 0}</td>
                <td>
                  {dashboard.school_facilities_and_equipments[0].values[index]['unsatisfactory'] ||
                    0}
                </td>
                <td>
                  {dashboard.school_facilities_and_equipments[0].values[index]['satisfactory'] || 0}
                </td>
                <td>{dashboard.school_facilities_and_equipments[0].values[index]['good'] || 0}</td>
                <td>
                  {dashboard.school_facilities_and_equipments[0].values[index]['very good'] || 0}
                </td>
                <td>
                  {index % 2 === 0
                    ? recommendations.equipments?.labels[1]
                    : recommendations.equipments?.labels[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
        <h5 className='text-start'>SCHOOL RULES AND POLICIES</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>1 - Very Poor</th>
            <th>2 - Poor</th>
            <th>3 - Satisfactory</th>
            <th>4 - Good</th>
            <th>5 - Excellent</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.school_rules_and_policies ? (
            dashboard.school_rules_and_policies[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start border border-dark'>{key}</td>
                <td>{dashboard.school_rules_and_policies[0].values[index]['poor'] || 0}</td>
                <td>
                  {dashboard.school_rules_and_policies[0].values[index]['unsatisfactory'] || 0}
                </td>
                <td>{dashboard.school_rules_and_policies[0].values[index]['satisfactory'] || 0}</td>
                <td>{dashboard.school_rules_and_policies[0].values[index]['good'] || 0}</td>
                <td>{dashboard.school_rules_and_policies[0].values[index]['very good'] || 0}</td>
                <td>
                  {index % 2 === 0
                    ? recommendations.policies?.labels[1]
                    : recommendations.policies?.labels[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
        <h5 className='text-start'>ADMINISTRATION</h5>
        <Table bordered>
          <tr className='border border-dark'>
            <th></th>
            <th>1 - Very Poor</th>
            <th>2 - Poor</th>
            <th>3 - Satisfactory</th>
            <th>4 - Good</th>
            <th>5 - Excellent</th>
            <th>Top Recommendation</th>
          </tr>
          {dashboard.administration ? (
            dashboard.administration[0]?.labels.map((key, index) => (
              <tr key={index} className='border border-dark'>
                <td className='text-start border border-dark'>{key}</td>
                <td>{dashboard.administration[0].values[index]['poor'] || 0}</td>
                <td>{dashboard.administration[0].values[index]['unsatisfactory'] || 0}</td>
                <td>{dashboard.administration[0].values[index]['satisfactory'] || 0}</td>
                <td>{dashboard.administration[0].values[index]['good'] || 0}</td>
                <td>{dashboard.administration[0].values[index]['very good'] || 0}</td>
                <td>
                  {index % 2 === 0
                    ? recommendations.admin?.labels[1]
                    : recommendations.admin?.labels[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No records</td>
            </tr>
          )}
        </Table>
        <br />
      </div>
    </div>
  );
};
