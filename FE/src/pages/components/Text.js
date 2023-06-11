import React from 'react';

export const Text = ({
  label = 'text',
  value = {
    answerid: null,
    questionid: null,
    answer: '',
    answerOptionId: null,
  },
  handleOnChange,
  required = false,
}) => {
  return (
    <div className='mb-4'>
      <h6>
        {label} {required ? <span className='text-danger'>(* required)</span> : null}
      </h6>
      <input
        type='text'
        className='form-control'
        value={value.answer}
        onChange={(e) => handleOnChange(value.questionid, 'description', e.target.value)}
        required={required}
      />
    </div>
  );
};
