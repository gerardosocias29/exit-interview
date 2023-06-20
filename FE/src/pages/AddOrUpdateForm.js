import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';

export const AddOrUpdateForm = () => {
  const question = {
    id: null,
    name: '',
    type: 'text',
    formid: null,
    placeholder: '',
    isRequired: 0,
    isFilter: 0,
    category: 'faculty and instructors',
    options: [],
    existOptions: [],
    delOptions: [],
    recommendations: [],
    existRecommendations: [],
    delRecommendations: [],
    sub_title: '',
  };

  const [form, setForm] = useState({ name: 'faculty and instructors' });
  const [questions, setQuestions] = useState([question]);
  const { id } = useParams();

  const options = [
    { value: 'ALL', label: 'ALL' },
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCRIM', label: 'BSCRIM' },
    { value: 'BSHM', label: 'BSHM' },
    { value: 'BEED', label: 'BEED' },
    { value: 'BSED-ENGLISH', label: 'BSED-ENGLISH' },
    { value: 'BSED-MATH', label: 'BSED-MATH' },
  ];

  const fetchData = async () => {
    const form = await apiRequest
      .get(`/form/${id}`)
      .then((res) => {
        return res.data || {};
      })
      .catch((error) => {
        console.log(error);
      });

    setForm(form);

    const questions = await apiRequest
      .get(`/form/${form.id}/questions`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });

    const options = await apiRequest
      .get('/options')
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });

    const arr = [];
    questions.map((q) => {
      let a = { ...question };
      a.id = q.id;
      a.name = q.name;
      a.type = q.type;
      a.formid = q.form_id;
      a.placeholder = q.placeholder;
      a.isRequired = q.isRequired;
      a.isFilter = q.isFilter;
      a.category = q.category;
      a.sub_title = q.sub_title;

      let o = options.filter((item) => item.question_id === q.id && item.type === 'options');
      let r = options.filter(
        (item) => item.question_id === q.id && item.type === 'recommendations',
      );

      o.length > 0 && (a.existOptions = o);
      r.length > 0 && (a.existRecommendations = r);
      arr.push(a);
    });

    setQuestions(arr);
  };

  useEffect(() => {
    id && fetchData();
  }, []);

  const handleOnChange = (key, value, i) => {
    const q = [...questions];
    if (key === 'options' || key === 'recommendations') {
      value = value === '' ? [] : value.split(',').map((item) => item.trim());
      q[i] = { ...q[i], [key]: value };
    } else if (key === 'delOptions' || key === 'delRecommendations') {
      let optionIndex = [...q[i][key]].findIndex((item) => item === value);
      if ([...q[i][key]].length === 0 || optionIndex > -1) {
        value = [...q[i][key], value];
        q[i] = { ...q[i], [key]: value };

        let existkey = key === 'delOptions' ? 'existOptions' : 'existRecommendations';

        let exValues = [...q[i][existkey]].filter((item) => !q[i][key].includes(item.id));

        q[i] = { ...q[i], existkey: exValues };
      }
    } else {
      if (key === 'isRequired' || key === 'isFilter') {
        value = value === 'true' ? 1 : 0;
      }
      if (key === 'radio' || key === 'checkbox') {
        q[i] = { ...q[i], isFilter: 1 };
      }

      q[i] = { ...q[i], [key]: value };
    }
    setQuestions(q);
  };

  const addQuestion = (e) => {
    e.preventDefault();
    setQuestions([...questions, question]);
  };

  const removeQuestion = (i) => {
    const q = [...questions];
    q.splice(i, 1);
    setQuestions(q);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    if (questions.length < 0) {
      alert('add atleast one question');
      return;
    }

    if (questions[0].name === '') {
      alert('missing fields');
      return;
    }

    if (id) {
      await apiRequest
        .patch(`question/${form.id}`, {
          form: {
            name: form.name,
            form_course: form.form_course,
            questions: questions,
          },
        })
        .then(() => {
          alert('successfully updated the form');
          window.location.href = '/forms';
        });
    } else {
      await apiRequest
        .post('question', {
          form: {
            name: form.name,
            form_course: form.form_course,
            questions: questions,
          },
        })
        .then(() => {
          alert('successfully created a form');
          window.location.href = '/forms';
        });
    }
  };

  const hasResponse = () => {
    if (id) {
      if (form.responses) {
        if (form.responses.length > 0) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <Page>
      <form onSubmit={onSubmit}>
        <div className='mb-4'>
          <h5>Category</h5>
          <select
            className='form-select'
            name={form.name}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          >
            {/* <option value='N/A' disabled>
              Please select category
            </option> */}
            {/* <option value='personal information'>PERSONAL INFORMATION</option> */}
            <option value='faculty and instructors'>FACULTY AND INSTRUCTORS</option>
            <option value='subjects'>SUBJECTS</option>
            <option value='student services'>STUDENT SERVICES</option>
            <option value='school plant'>SCHOOL PLANT</option>
            <option value='school facilities and equipments'>
              SCHOOL FACILITIES AND EQUIPMENTS
            </option>
            <option value='school rules and policies'>SCHOOL RULES AND POLICIES</option>
            <option value='administration'>ADMINISTRATION</option>
          </select>
        </div>
        <div className='mb-5'>
          <h6>Course</h6>
          <select
            className='form-control'
            name='instructors'
            onChange={(e) => setForm({ ...form, form_course: e.target.value })}
            required
          >
            <option value={null}>Select a Course</option>
            {options.map((item, index) => (
              <option key={index} value={item.value} selected={item.value === form.form_course}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <h5>Questions</h5>
        <div className='mb-5'>
          {questions.map((key, index) => (
            <React.Fragment key={index}>
              {questions.length > 1 && !hasResponse() && (
                <button
                  type='button'
                  className='btn btn-danger me-4 mb-2'
                  onClick={() => removeQuestion(index)}
                >
                  Delete
                </button>
              )}
              <div className='row g-3 mb-4 mb-3'>
                <div className='col'>
                  <h6 className='form-label'>Question {index + 1}</h6>
                  <textarea
                    className='form-control'
                    value={key.name}
                    onChange={(e) => handleOnChange('name', e.target.value, index)}
                  ></textarea>
                </div>
              </div>
              <div className='row g-3 mb-4'>
                <div className='col'>
                  <label className='form-label'>Type</label>
                  <select
                    className='form-select'
                    name={key.name}
                    value={key.type}
                    onChange={(e) => handleOnChange('type', e.target.value, index)}
                  >
                    <option value='text'>text</option>
                    <option value='radio'>radio</option>
                    <option value='checkbox'>checkbox</option>
                    <option value='textarea'>textarea</option>
                  </select>
                </div>
                <div className='col'>
                  <div className='row'>
                    <div className='col'>
                      <label className='form-label'>Is this field required?</label>
                      <div className='form-control form-check-inline' key={index}>
                        <input
                          className='form-check-input'
                          type='radio'
                          name={`required${index}`}
                          value={true}
                          checked={key.isRequired === 1}
                          onChange={(e) => handleOnChange('isRequired', e.target.value, index)}
                        />
                        <label className='form-check-label mx-2'>Yes</label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name={`required${index}`}
                          value={false}
                          checked={key.isRequired === 0}
                          onChange={(e) => handleOnChange('isRequired', e.target.value, index)}
                        />
                        <label className='form-check-label ms-2'>No</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col'>
                  <div className='row'>
                    <div className='col'>
                      <label className='form-label'>Is this data used in dashboard?</label>
                      <div className='form-control form-check-inline' key={index}>
                        <input
                          className='form-check-input'
                          type='radio'
                          name={`required${index}-filter`}
                          value={true}
                          checked={key.isFilter === 1}
                          onChange={(e) => handleOnChange('isFilter', e.target.value, index)}
                        />
                        <label className='form-check-label mx-2'>Yes</label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name={`required${index}-filter`}
                          value={false}
                          checked={key.isFilter === 0}
                          onChange={(e) => handleOnChange('isFilter', e.target.value, index)}
                        />
                        <label className='form-check-label ms-2'>No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {(key.type === 'radio' || key.type === 'checkbox') && (
                <div className='mb-3'>
                  <h6>Options</h6>
                  {key.existOptions.length > 0 ? (
                    <>
                      {' '}
                      <span className='fst-italic text-danger text-sm'>* Existing Options</span>
                      <br />
                    </>
                  ) : null}

                  {id &&
                    key.existOptions.length > 0 &&
                    key.existOptions.map((o, i) => (
                      <div className='d-grid gap-3 w-50' key={i}>
                        <div className='mb-3 row'>
                          <div className='col-sm-11'>
                            <input type='text' className='form-control' value={o.name} disabled />
                          </div>
                          {!hasResponse() && (
                            <button
                              type='button'
                              className='col-sm-1 btn btn-danger'
                              onClick={() => handleOnChange('delOptions', o.id, index)}
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  <br />
                  <span className='fst-italic text-danger text-sm'>
                    * Please add options separated by comma ex. (orange,red,green,blue)
                  </span>
                  <textarea
                    className='form-control'
                    placeholder='orange,red,green,blue'
                    onChange={(e) => handleOnChange('options', e.target.value, index)}
                  ></textarea>
                </div>
              )}
              {(key.type === 'radio' || key.type === 'checkbox') && key.isFilter ? (
                <div className='mb-3'>
                  <h6>Recommendations</h6>
                  {key.existRecommendations.length > 0 ? (
                    <>
                      {' '}
                      <span className='fst-italic text-danger text-sm'>
                        * Existing Recommendations
                      </span>
                      <br />
                    </>
                  ) : null}

                  {id &&
                    key.existRecommendations.length > 0 &&
                    key.existRecommendations.map((o, i) => (
                      <div className='d-grid gap-3 w-50' key={i}>
                        <div className='mb-3 row'>
                          <div className='col-sm-11'>
                            <input type='text' className='form-control' value={o.name} disabled />
                          </div>
                          {!hasResponse() && (
                            <button
                              type='button'
                              className='col-sm-1 btn btn-danger'
                              onClick={() => handleOnChange('delRecommendations', o.id, index)}
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  <br />
                  <span className='fst-italic text-danger text-sm'>
                    * Please add recommendations separated by comma ex. (orange,red,green,blue)
                  </span>
                  <textarea
                    className='form-control'
                    placeholder='orange,red,green,blue'
                    onChange={(e) => handleOnChange('recommendations', e.target.value, index)}
                  ></textarea>
                </div>
              ) : null}

              <hr />
            </React.Fragment>
          ))}
          <button className='btn btn-primary mb-5' onClick={(e) => addQuestion(e)}>
            + Add Question
          </button>
          <br />
          <button className='btn btn-primary' type='submit'>
            Submit
          </button>
        </div>
      </form>
    </Page>
  );
};
