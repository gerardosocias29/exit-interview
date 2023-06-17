import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import { apiRequest } from '../utils/apiRequest';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { recommendations } from '../utils/dummy';

export const Download = () => {
  const [dashboard, setDashboard] = useState([]);
  const exportRef = useRef();

  const [instructorLearnTheMost, setInstructorLearnTheMost] = useState([]);
  const [instructorLearnTheLeast, setInstructorLearnTheLeast] = useState([]);

  const [subjectLearnTheMost, setSubjectLearnTheMost] = useState([]);
  const [subjectLearnTheLeast, setSubjectLearnTheLeast] = useState([]);

  const [studentServices, setStudentServices] = useState([]);
  const [officeNames, setOfficeNames] = useState([]);

  const [schoolPlant, setSchoolPlant] = useState([]);
  const [extractedSchoolPlant, setExtractedSchoolPlant] = useState([]);

  const [facilitiesEquipment, setFacilitiesEquipment] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [schoolRulesAndPolicies, setSchoolRulesAndPolicies] = useState([]);
  const [rulesAndPolicies, setRulesAndPolicies] = useState([]);

  const [administrations, setAdministrations] = useState([]);
  const [departments, setDepartments] = useState([]);
  // Function to search for the keywords in the questions
  const searchQuestions = (data, searchKeywords) => {
    const foundQuestions = [];

    data.stats.forEach((stat) => {
      const category = Object.keys(stat)[0];
      const questions = stat[category].questions;

      questions.forEach((question) => {
        const questionText = question.question.toLowerCase();
        const containsAllKeywords = searchKeywords.every((keyword) =>
          questionText.includes(keyword.toLowerCase())
        );

        if (containsAllKeywords) {
          foundQuestions.push(question);
        }
      });
    });

    return foundQuestions;
  };

  const fetchData = async () => {
    await apiRequest
      .get(`/stats`)
      .then((res) => {
        setDashboard(res.data || []);
        setInstructorLearnTheMost(searchQuestions(res.data, ['instructor', 'learn', 'the', 'most'])[0] || {});
        setInstructorLearnTheLeast(searchQuestions(res.data, ['instructor', 'learn', 'the', 'least'])[0] || {});
        setSubjectLearnTheMost(searchQuestions(res.data, ['subjects', 'learn', 'the', 'most'])[0] || {});
        setSubjectLearnTheLeast(searchQuestions(res.data, ['subjects', 'learn', 'the', 'least'])[0] || {});

        var studentService = res.data.stats.filter((d, i) => (res.data.stats[i].student_services != null))[0].student_services;
        setStudentServices(studentService || []);
        console.log("res.data.stats.student_services", studentService);    
        var extractedOffices = (studentService?.questions || []).map((question) => {
          const match = question.question.match(/Rank the (.+?) Office in BCC/);
          return match ? match[1] : '';
        });
        setOfficeNames(extractedOffices);
        
        var schoolPlant = res.data.stats.filter((d, i) => (res.data.stats[i].school_plant != null))[0].school_plant;
        setSchoolPlant(schoolPlant || []);
        var extractedSchoolPlant = (schoolPlant?.questions || []).map((question) => {
          const match = question.question.match(/recommendation(?:s)? for (.+?) that/);
          return match ? match[1] : '';
        });
        setExtractedSchoolPlant(extractedSchoolPlant);

        var school_facilities_and_equipments = res.data.stats.filter((d, i) => (res.data.stats[i].school_facilities_and_equipments != null))[0].school_facilities_and_equipments;
        setFacilitiesEquipment(school_facilities_and_equipments);
        var extractedFacilities = (school_facilities_and_equipments?.questions || []).map((question) => {
          const match = question.question.match(/recommendation(?:s)? for (.+?) that/);
          return match ? match[1] : '';
        });
        setFacilities(extractedFacilities);

        var school_rules_and_policies = res.data.stats.filter((d, i) => (res.data.stats[i].school_rules_and_policies != null))[0].school_rules_and_policies;
        setSchoolRulesAndPolicies(school_rules_and_policies);
        var rules_and_policies = (school_rules_and_policies?.questions || []).map((question) => {
          const match = question.question.match(/Rank the (.+?) as school Rules and Policies/);
          return match ? match[1] : '';
        });
        setRulesAndPolicies(rules_and_policies);
        console.log("rules_and_policies", rules_and_policies);

        var administration = res.data.stats.filter((d, i) => (res.data.stats[i].administration != null))[0].administration;
        setAdministrations(administration);
        var department = (administration?.questions || []).map((question) => {
          const match = question.question.match(/In your department, rank the (.+?) from you like the most to the least/);
          return match ? match[1] : '';
        });
        setDepartments(department);
        console.log("department", department);
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
          <thead>
            <tr className='border border-dark'>
              <th className='col-xl-2'>Learn the Most</th>
              <th className='col-xl-4'>Learns The Most Top Recommendation</th>
              <th className='col-xl-2'>Learn the Least</th>
              <th className='col-xl-4'>Learn the Least Top Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
              {
                instructorLearnTheMost &&
                instructorLearnTheMost.answers &&
                instructorLearnTheMost.answers.answer &&
                Object.keys(instructorLearnTheMost.answers.answer).reduce((maxKey, currentKey) => {
                  if (instructorLearnTheMost.answers.answer[currentKey] > instructorLearnTheMost.answers.answer[maxKey]) {
                    return currentKey;
                  }
                  return maxKey;
                }, Object.keys(instructorLearnTheMost.answers.answer)[0]).toUpperCase()
              }
              </td>
              <td>
              {
                instructorLearnTheMost &&
                instructorLearnTheMost.answers &&
                instructorLearnTheMost.answers.recommendations &&
                Object.keys(instructorLearnTheMost.answers.recommendations).reduce(
                  (maxKey, key) => {
                    const currentVal = instructorLearnTheMost.answers.recommendations[key];
                    const maxValue = instructorLearnTheMost.answers.recommendations[maxKey];
                    return currentVal > maxValue ? key : maxKey;
                  }, Object.keys(instructorLearnTheMost.answers.recommendations)[0]
                ).toUpperCase()
              }
              </td>
              <td>
                {
                  instructorLearnTheLeast &&
                  instructorLearnTheLeast.answers &&
                  instructorLearnTheLeast.answers.answer &&
                  Object.keys(instructorLearnTheLeast.answers.answer).reduce((maxKey, currentKey) => {
                    if (instructorLearnTheLeast.answers.answer[currentKey] > instructorLearnTheLeast.answers.answer[maxKey]) {
                      return currentKey;
                    }
                    return maxKey;
                  }, Object.keys(instructorLearnTheLeast.answers.answer)[0]).toUpperCase()
                }
              </td>
              <td>
                {
                  instructorLearnTheLeast &&
                  instructorLearnTheLeast.answers &&
                  instructorLearnTheLeast.answers.recommendations &&
                  Object.keys(instructorLearnTheLeast.answers.recommendations).reduce(
                    (maxKey, key) => {
                      const currentVal = instructorLearnTheLeast.answers.recommendations[key];
                      const maxValue = instructorLearnTheLeast.answers.recommendations[maxKey];
                      return currentVal > maxValue ? key : maxKey;
                    }, Object.keys(instructorLearnTheLeast.answers.recommendations)[0]
                  ).toUpperCase()
                }
              </td>
            </tr>
          </tbody>
        </Table>
        <br />
        <h5 className='text-start'>SUBJECTS</h5>
        <Table bordered>
          <thead>
            <tr className='border border-dark'>
              <th className='col-lg-6'>Learn the Most</th>
              <th className='col-lg-6'>Learn the Least</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>
                  {
                    subjectLearnTheMost &&
                    subjectLearnTheMost.answers &&
                    subjectLearnTheMost.answers.answer &&
                    Object.keys(subjectLearnTheMost.answers.answer).reduce((maxKey, currentKey) => {
                      if (subjectLearnTheMost.answers.answer[currentKey] > subjectLearnTheMost.answers.answer[maxKey]) {
                        return currentKey;
                      }
                      return maxKey;
                    }, Object.keys(subjectLearnTheMost.answers.answer)[0]).toUpperCase()
                  }
                </td>
                <td>
                  {
                    subjectLearnTheLeast &&
                    subjectLearnTheLeast.answers &&
                    subjectLearnTheLeast.answers.answer &&
                    Object.keys(subjectLearnTheLeast.answers.answer).reduce((maxKey, currentKey) => {
                      if (subjectLearnTheLeast.answers.answer[currentKey] > subjectLearnTheLeast.answers.answer[maxKey]) {
                        return currentKey;
                      }
                      return maxKey;
                    }, Object.keys(subjectLearnTheLeast.answers.answer)[0]).toUpperCase()
                  }
                </td>
              </tr>
          </tbody>
        </Table>
        <h5 className='text-start'>STUDENT SERVICES</h5> {/* all students services should be ranking */}
        <Table bordered>
          <thead>
            <tr className='border border-dark'>
              <th className='align-middle col-xl-6' rowSpan="2">Office Name</th>
              <th colSpan="5">Ranking</th>
              <th className='align-middle' rowSpan={2}>Recommendation</th>
            </tr>
            <tr className='border border-dark'>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
            </tr>
          </thead>
          <tbody>
            {studentServices &&
              Array.isArray(studentServices.questions) &&
              studentServices.questions.map((question, index) => {
                const officeName = officeNames && officeNames[index];
                const highestRecommendation = Object.entries(question.answers.recommendations)
                  .sort(([, a], [, b]) => b - a)
                  .map(([recommendation]) => recommendation)[0] || '';
                return (
                  <tr key={index}>
                    <td>{`${officeName} Office`.toUpperCase()} </td>
                    {[1, 2, 3, 4, 5].map((ranking) => (
                      <td key={ranking}>{question.answers.answer[ranking] || ''}</td>
                    ))}
                    <td>{highestRecommendation.toUpperCase()}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>

        <h5 className='text-start'>SCHOOL PLANT</h5>
        <Table bordered>
          <thead>
            <tr className='border border-dark'>
              <th className='col-lg-6'></th>
              <th className='col-lg-6'>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {
              schoolPlant &&
              Array.isArray(schoolPlant.questions) &&
              schoolPlant.questions.map((question, index) => {
                const bldg = extractedSchoolPlant && extractedSchoolPlant[index];
                const highestRecommendation = Object.entries(question.answers.answer)
                  .sort(([, a], [, b]) => b - a)
                  .map(([answer]) => answer)[0] || '';
                return (
                  <tr key={index}>
                    <td>{`${bldg}`.toUpperCase()} </td>
                    <td>{highestRecommendation}</td>
                  </tr>
                );
              })
            }
          </tbody> 
        </Table>

        <h5 className='text-start'>FACILITIES AND EQUIPMENT</h5>
        <Table bordered>
          <thead>
            <tr className='border border-dark'>
              <th className='col-lg-6'>Facilities and Equipments</th>
              <th className='col-lg-6'>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {
              facilitiesEquipment &&
              Array.isArray(facilitiesEquipment.questions) &&
              facilitiesEquipment.questions.map((question, index) => {
                const facility = facilities && facilities[index];
                const highestRecommendation = Object.entries(question.answers.answer)
                  .sort(([, a], [, b]) => b - a)
                  .map(([answer]) => answer)[0] || '';
                return (
                  <tr key={index}>
                    <td>{`${facility}`.toUpperCase()} </td>
                    <td>{highestRecommendation}</td>
                  </tr>
                );
              })
            }
          </tbody> 
        </Table>

        <h5 className='text-start'>SCHOOL RULES AND POLICIES</h5>
        <Table bordered>
          <thead>
            <tr className='border border-dark'>
              <th className='align-middle col-xl-3' rowSpan="2">Rules and Policies</th>
              <th colSpan="10">Ranking</th>
              {/* <th className='align-middle' rowSpan={2}>Recommendation</th> */}
            </tr>
            <tr className='border border-dark'>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
            </tr>
          </thead>
          <tbody>
            {schoolRulesAndPolicies &&
              Array.isArray(schoolRulesAndPolicies.questions) &&
              schoolRulesAndPolicies.questions.map((question, index) => {
                const policy = rulesAndPolicies && rulesAndPolicies[index];
                const highestRecommendation = Object.entries(question.answers.recommendations)
                  .sort(([, a], [, b]) => b - a)
                  .map(([recommendation]) => recommendation)[0] || '';
                return (
                  <tr key={index}>
                    <td>{`${policy}`.toUpperCase()} </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ranking) => (
                      <td key={ranking}>{question.answers.answer[ranking] || ''}</td>
                    ))}
                    {/* <td>{highestRecommendation.toUpperCase()}</td> */}
                  </tr>
                );
              }
            )}
          </tbody> 
        </Table>

        <h5 className='text-start'>ADMINISTRATION</h5>
        <Table bordered>
          <thead>
            <tr className='border border-dark'>
              <th className='align-middle col-xl-3' rowSpan="2">Rules and Policies</th>
              <th colSpan="4">Ranking</th>
              <th className='align-middle' rowSpan={2}>Recommendation</th>
            </tr>
            <tr className='border border-dark'>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
            </tr>
          </thead>
          <tbody>
            {administrations &&
              Array.isArray(administrations.questions) &&
              administrations.questions.map((question, index) => {
                const dept = departments && departments[index];
                const highestRecommendation = Object.entries(question.answers.recommendations)
                  .sort(([, a], [, b]) => b - a)
                  .map(([recommendation]) => recommendation)[0] || '';
                return (
                  <tr key={index}>
                    <td>{`${dept}`.toUpperCase()} </td>
                    {[1, 2, 3, 4].map((ranking) => (
                      <td key={ranking}>{question.answers.answer[ranking] || ''}</td>
                    ))}
                    <td>{highestRecommendation.toUpperCase()}</td>
                  </tr>
                );
              }
            )}
          </tbody> 
        </Table>
        {/* <h5 className='text-start'>SUBJECTS</h5>
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
        <br /> */}
      </div>
    </div>
  );
};
