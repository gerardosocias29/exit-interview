import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

export const SurveyResponseDetail = () => {
  const { id, user_form_id } = useParams();
  const [form, setForm] = useState({});
  const [questions, setQuestions] = useState([]);

  const fetchData = async () => {
    const forms = await apiRequest
      .get(`/user-form/${user_form_id}`)
      .then((res) => {
        return res.data[0] || {};
      })
      .catch((error) => {
        console.log(error);
      });

    const questions = await apiRequest
      .get(`/form/${user_form_id}/questions/answers`)
      .then((res) => {
        return res.data['individual'];
      })
      .catch((error) => {
        console.log(error);
      });

    setForm(forms);
    setQuestions(questions);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getOptionAnswer = (options, id, type = 'options') => {
    return options.filter((item) => item.id === id && item.type === type)[0]?.name;
  };

  return (
    <Page>
      <h4 className='text-center mb-3'>{form.forms && form.forms.name}</h4>
      <p className='text-center mb-3'>{form.users && form.users.name}</p>
      <p className='text-center mb-5'>
        {DateTime.fromISO(form.created_at).toFormat('MMMM dd, yyyy')}
      </p>
      <div>
        {questions.length > 0 &&
          questions.map((key, index) => (
            <div key={index} className='mb-3 border-bottom'>
              <h5>
                Question {index + 1}: {key.question.name}
              </h5>
              <h6>Answer/s:</h6>
              {key.answer[0]?.type === 'text' ? (
                <p>{key.answer.description}</p>
              ) : (
                <>
                  <ul>
                    {key.answer.map(
                      (i, idx) =>
                        getOptionAnswer(key.question.options, i.option_id) && (
                          <li key={idx}>
                            {key.question.options &&
                              getOptionAnswer(key.question.options, i.option_id)}
                          </li>
                        ),
                    )}
                  </ul>
                </>
              )}
              {key.category !== 'N/A' && (
                <>
                  <h6>Reason</h6>
                  <p>{key.answer[0]?.reason}</p>
                  <h6>Recommendation</h6>
                  <p>
                    {getOptionAnswer(
                      key.question.options,
                      key.answer[key.answer.length - 1].option_id,
                      'recommendations',
                    )}
                  </p>
                </>
              )}
            </div>
          ))}
      </div>
    </Page>
  );
};
