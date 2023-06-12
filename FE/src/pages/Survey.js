import React, { useState, useEffect } from 'react';
import { Text } from './components/Text';
import { TextArea } from './components/TextArea';
import { Radio } from './components/Radio';
import { Checkbox } from './components/Checkbox';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';

export const Survey = () => {
  const [forms, setForms] = useState([]);
  const { course } = useParams();
  const [questionsOptions, setQuestionsOptions] = useState([]);
  const [courses, setCourses] = useState([]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    course: '',
    course_id: '',
    birthdate: '',
    contact: '',
    address: '',
    messenger: '',
  });

  const courseoptions = [
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BSCRIM', label: 'BSCRIM' },
    { value: 'BSHM', label: 'BSHM' },
    { value: 'BEED', label: 'BEED' },
    { value: 'BSED-ENGLISH', label: 'BSED-ENGLISH' },
    { value: 'BSED-MATH', label: 'BSED-MATH' },
  ];

  const fetchCourseData = async () => {
    await apiRequest
      .get(`/course`)
      .then((res) => {
        if (res.data && res.data.length !== 0) {
          setCourses(res.data.map((item) => ({ value: item.id, label: item.name.toUpperCase() })));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams();
    //if (keyword !== '') {
    urlSearchParams.append('keyword', course);
    //}
    await apiRequest
      .get(`/form?${urlSearchParams.toString()}`)
      .then((res) => {
        setForms(res.data);
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

    setQuestionsOptions(options);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(user);

    const returnuser = await apiRequest.post('/register', user).then((res) => res.data.user);

    await apiRequest
      .post(`/answer`, {
        survey: {
          user_id: returnuser.id,
          answers: arr,
          forms: forms.map((form) => form.id),
        },
      })
      .then((res) => {
        window.location.href = '/thanks';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchCourseData();
  }, []);

  const getOptions = (id) => {
    return questionsOptions?.filter((option) => option.question_id === id) || [];
  };

  const getReco = (id) => {
    return (
      questionsOptions?.filter(
        (option) => option.question_id === id && option.type === 'recommendations',
      ) || []
    );
  };

  const answers = {
    answerid: null,
    questionid: null,
    description: null,
    answerOptionId: null,
    remarks: null,
    formid: '',
    subjects_handled: null,
    reason: null,
    instructor: null,
    type: 'options',
  };
  const arr = [];

  const handleOnChange = (id, field, value, type = 'options') => {
    const index = arr.findIndex((key) => key.questionid === id && key.type === type);
    console.log(arr);
    arr[index] = { ...arr[index], [field]: value };
  };

  const getValue = (id) => {
    const index = arr.findIndex((key) => key.questionid === id);
    return arr[index];
  };

  const getSubjectsOrInstructorField = (id, category) => {
    if (category === 'subjects') {
      return (
        <div className='mb-4'>
          <label>
            Instructor <span className='text-danger'>(* required)</span>
          </label>
          <input
            type='text'
            className='form-control'
            value={getValue(id).instructor}
            onChange={(e) => handleOnChange(id, 'instructor', e.target.value)}
            required
          />
        </div>
      );
    } else if (category === 'faculty and instructions') {
      return (
        <div className='mb-4'>
          <label>
            Subject Handled <span className='text-danger'>(* required)</span>
          </label>
          <input
            type='text'
            className='form-control'
            value={getValue(id).subjects_handled}
            onChange={(e) => handleOnChange(id, 'subjects_handled', e.target.value)}
            required
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const getRemarks = (id) => {
    return (
      <>
        <div className='mb-4'>
          <label>
            Why <span className='text-danger'>(* required)</span>
          </label>
          <textarea
            className='form-control'
            value={getValue(id).reason}
            onChange={(e) => handleOnChange(id, 'reason', e.target.value)}
            required
          />
        </div>
      </>
    );
  };

  const fields = (key) => {
    arr.push({ ...answers, questionid: key.id, formid: key.form_id });
    switch (key.type) {
      case 'text':
        return (
          <Text
            required={key.isRequired}
            label={key.name}
            value={getValue(key.id)}
            handleOnChange={handleOnChange}
          />
        );
      case 'textarea':
        return (
          <TextArea
            required={key.isRequired}
            label={key.name}
            value={getValue(key.id)}
            handleOnChange={handleOnChange}
          />
        );
      case 'radio':
        return (
          <Radio
            label={key.name}
            value={getValue(key.id)}
            handleOnChange={handleOnChange}
            options={getOptions(key.id).filter((item) => item.type === 'options')}
            required={key.isRequired}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            label={key.name}
            value={getValue(key.id)}
            handleOnChange={handleOnChange}
            options={getOptions(key.id)}
            required={key.isRequired}
          />
        );
      default:
        return null;
    }
  };

  const getRecommendation = (key) => {
    arr.push({ ...answers, questionid: key.id, type: 'recommendations', formid: key.form_id });
    return (
      <>
        <Checkbox
          label='Recommendations (Please check whathever is applicable)'
          value={getValue(key.id)}
          handleOnChange={handleOnChange}
          options={getOptions(key.id).filter((item) => item.type === 'recommendations')}
          required
        />
        {/* <div className='mb-4'>
          <label>Other's please specify</label>
          <textarea
            className='form-control'
            value={getValue(key.id).remarks}
            onChange={(e) => handleOnChange(key.id, 'remarks', e.target.value)}
          />
        </div> */}
      </>
    );
  };

  // const getIndex = (cat, id) => {
  //   const c = questions.filter((q) => q.category === cat);
  //   return c.findIndex((i) => i.id === id) + 1;
  // };

  return (
    <>
      <div className='min-vh-100 d-flex justify-content-center p-5 bg-main-student'>
        <div className='card border-0 w-75'>
          <div className='card-body'>
            <form onSubmit={onSubmit}>
              <h4>Personal Information</h4>
              <div className='mb-3'>
                <h6>Name</h6>
                <input
                  type='text'
                  className='form-control'
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <h6>Course</h6>
                <select
                  className='form-control'
                  name='instructors'
                  onChange={(e) =>
                    setUser({
                      ...user,
                      course: courses.filter((item) => item.value == e.target.value)[0].label,
                      course_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value={null}>Select a Course</option>
                  {courses.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-3'>
                <h6>Email</h6>
                <input
                  type='email'
                  className='form-control'
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <h6>Contact</h6>
                <input
                  type='text'
                  className='form-control'
                  maxLength='11'
                  pattern='^[0-9,]*$'
                  onChange={(e) => setUser({ ...user, contact: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <h6>Address</h6>
                <textarea
                  className='form-control'
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <h6>Birthdate</h6>
                <input
                  type='date'
                  className='form-control'
                  onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <h6>Messenger</h6>
                <input
                  type='text'
                  className='form-control'
                  onChange={(e) => setUser({ ...user, messenger: e.target.value })}
                />
              </div>
              {forms.map((f, ind) => (
                <div className='mb-3'>
                  <h4>{f.name}</h4>
                  {f.questions.map((key, index) => (
                    <div key={index} className={`p-3 rounded`}>
                      <h6>Question {index + 1}</h6>
                      {fields(key)}
                      {/* {key.category !== 'N/A' && getSubjectsOrInstructorField(key.id, key.category)} */}
                      {key.category !== 'N/A' && key.name !== 'Others' && getOptions(key.id).filter((item) => item.type === 'recommendations').length > 0 && getRecommendation(key)}
                      {/* {key.category !== 'N/A' && key.name !== 'Others' && getRemarks(key.id)} */}
                    </div>
                  ))}
                </div>
              ))}
              <button className='btn btn-primary' type='submit'>
                submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* // <Container className='mx-auto py-4'>
      //   <h4 className='text-center mb-3'>{form.name}</h4>
      //   <div className='border p-2 rounded bg-white'>
      //     <b></b>Instructions:
      //     <ul>
      //       <li>Please input necessary details in the required fields in the form</li>
      //       <li>Be honest in answering.</li>
      //       <li>
      //         Please rate your experience with the following criteria
      //         <ul>
      //           <li>(Most Like = 5 | Least Like = 1)</li>
      //         </ul>
      //       </li>
      //     </ul>
      //   </div>
      // </Container> */}

      {/* <MultiStep activeStep={1} showNavigation={true}>
          <StepOne title='StepOne'/>
          <StepTwo title='StepTwo'/>
          <StepThree title='StepThree'/>
          <StepFour title='StepFour'/>
      </MultiStep> */}

      {/* // <form onSubmit={onSubmit}>
      //   {questions.map((key, index) => (
      //     <div key={index} className={`p-3 rounded`}>
      //       <h6>Question {getIndex(key.category, key.id)}</h6>
      //       {fields(key)}
      //       {key.category !== 'N/A' && getSubjectsOrInstructorField(key.id, key.category)}
      //       {key.category !== 'N/A' && key.name !== 'Others' && getRecommendation(key)}
      //       {key.category !== 'N/A' && key.name !== 'Others' && getRemarks(key.id)}
      //     </div>
      //   ))}
      //   <button className='btn btn-primary' type='submit'>
      //     submit
      //   </button>
      // </form> */}
    </>
  );
};
