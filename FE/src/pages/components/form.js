import React from 'react';
import { Text } from './components/Text';
import { TextArea } from './components/TextArea';
import { Radio } from './components/Radio';
import { Checkbox } from './components/Checkbox';

export const form = ({ questions, handleOnChange, getValue }) => {
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
    arr.push({ ...answers, questionid: key.id });
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
            options={key.options.filter((item) => item.type === 'options')}
            required={key.isRequired}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            label={key.name}
            value={getValue(key.id)}
            handleOnChange={handleOnChange}
            options={key.options}
            required={key.isRequired}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div>
      {questions.map((key, index) => (
        <div key={index} className={`p-3 rounded`}>
          <h6>Question {getIndex(key.category, key.id)}</h6>
          {fields(key)}
          {key.category !== 'N/A' && getSubjectsOrInstructorField(key.id, key.category)}
          {key.category !== 'N/A' && key.name !== 'Others' && getRecommendation(key)}
          {key.category !== 'N/A' && key.name !== 'Others' && getRemarks(key.id)}
        </div>
      ))}
    </div>
  );
};
