import React, { useState, useEffect } from 'react';
import { Page } from './Page';
import { apiRequest } from '../utils/apiRequest';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

export const SurveyResponseGroupDetail = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [user, setUser] = useState({});

  const fetchData = async () => {
    await apiRequest
      .get(`/question/${id}/response`)
      .then((res) => {
        setForm(res.data.data);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getOptionAnswer = (options, id, type = 'options') => {
    return options.filter((item) => item.id === id && item.type === type)[0]?.name || 'None';
  };

  return (
    <Page>
      <h4 className='text-center mb-3'>{user && user.name}</h4>
      <p className='text-center mb-5'>
        {DateTime.fromISO(form[0]?.form.created_at).toFormat('MMMM dd, yyyy')}
      </p>
      <div>
        {form.length > 0 &&
          form.map((key, index) => (
            <div key={index} className='mb-3'>
              <h5>{key.form.name}</h5>
              {key.answers.length > 0 ? (
                key.answers.map((item, c) => (
                  <div>
                    <h6>
                      Question {c + 1}: {item.question.name}
                    </h6>

                    <h6>Answer/s:</h6>
                    {item.answer[0]?.type === 'text' ? (
                      <p>{item.answer[0]?.description}</p>
                    ) : (
                      <>
                        <ul>
                          {item.answer.map(
                            (i, idx) =>
                              getOptionAnswer(item.question.options, i.option_id) && (
                                <li key={idx}>
                                  {item.question.options &&
                                    getOptionAnswer(item.question.options, i.option_id)}
                                </li>
                              ),
                          )}
                        </ul>
                      </>
                    )}
                    {item.question.category !== 'N/A' && (
                      <>
                        <h6>Reason</h6>
                        <ul>
                          <li>{item.answer[0]?.reason}</li>
                        </ul>
                        <h6>Recommendation</h6>
                        <ul>
                          <li>
                            {getOptionAnswer(
                              item.question.options,
                              item.answer[item.answer.length - 1]?.option_id,
                              'recommendations',
                            )}
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No response</p>
              )}
              <hr />
            </div>
          ))}
      </div>
    </Page>
  );
};
