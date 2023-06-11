import React from 'react';

export const TextArea = ({
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
      <textarea
        className='form-control'
        value={value.answer}
        onChange={(e) => handleOnChange(value.questionid, 'description', e.target.value)}
        required={required}
      />
    </div>
  );
};
