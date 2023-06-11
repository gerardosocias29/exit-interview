import React from 'react';

export const Radio = ({
  label = 'text',
  value = {
    answerid: null,
    questionid: null,
    answer: null,
    answerOptionId: null,
  },
  options = [],
  handleOnChange,
  required = false,
}) => {
  return (
    <div className='mb-4'>
      <h6>
        {label} {required ? <span className='text-danger'>(* required)</span> : null}
      </h6>
      {options.map((key, index) => (
        <div className={`form-check ${options.length <= 5 ? 'form-check-inline' : ''}`} key={index}>
          <input
            className='form-check-input'
            type='radio'
            name={label}
            value={key.id}
            key={index}
            onChange={(e) => handleOnChange(value.questionid, 'answerOptionId', e.target.value)}
            required={required}
          />
          <label className='form-check-label'>{key.name}</label>
        </div>
      ))}
    </div>
  );
};
