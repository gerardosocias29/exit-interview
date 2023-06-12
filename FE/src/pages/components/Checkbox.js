import React, { useState } from 'react';
import { generateRandomId } from '../../utils/random';

export const Checkbox = ({
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
  const [origArr, setOrigArr] = useState([]);
  const randomId = generateRandomId();
  const getIds = (id) => {
    const arr = [...origArr];
    const index = arr.findIndex((arr) => arr === id);
    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(id);
    }
    setOrigArr(arr);
    const type = label.toLowerCase().includes('recommendations') ? 'recommendations' : 'options';
    console.log(type);
    handleOnChange(value.questionid, 'answerOptionId', arr, type);
  };
  return (
    <div className='mb-4'>
      <h6>
        {label} {required ? <span className='text-danger'>(* required)</span> : null}
      </h6>
      {options.map((key, index) => (
        <div className='form-check form-check-inline' key={index}>
          <input
            id={randomId+'-'+index}
            className='form-check-input'
            type='checkbox'
            name={key.id}
            value={key.id}
            required={required ? (origArr.length === 0 ? true : false) : false}
            onChange={(e) => getIds(e.target.value)}
          />
          <label htmlFor={randomId+'-'+index} className='form-check-label'>{key.name}</label>
        </div>
      ))}
    </div>
  );
};
