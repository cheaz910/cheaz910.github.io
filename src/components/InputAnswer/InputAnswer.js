import { useState, useEffect, memo } from 'react';

import './styles.css';

const InputAnswer = ({question, trueAnswer, id, onAnswer, answers, hint}) => {
  const [value, setValue] = useState('');
  const [isTrue, setIsTrue] = useState();

  const onSubmit = () => {
    setIsTrue(value === trueAnswer);
    onAnswer(value === trueAnswer)
  }
  return (
    <div className={`Question${isTrue === true ? ' Title__true' : (isTrue === false ? ' Title__false' : '')}`}>
      <div className={`Title`}>
        {question}
      </div>
      <input disabled={isTrue === false} onChange={e => setValue(e.target.value.toLowerCase())} />{hint && <span>{hint}</span>}
      <button className="Button" disabled={isTrue === false} onClick={onSubmit}>ОК</button>
    </div>
  );
};

export default memo(InputAnswer);