import { useState, useEffect, memo } from 'react';

import './styles.css';

const BlanksAnswer = ({question, trueAnswer, id, onAnswer, answers}) => {
  const [values, setValues] = useState([]);
  const [isTrue, setIsTrue] = useState();
  const questionSplitted = question.split('$');

  const onSubmit = () => {
    console.log(trueAnswer, values);
    for (let i = 0; i < trueAnswer.length; i++) {
      if (values[i] !== trueAnswer[i]) {
        setIsTrue(false);
        onAnswer(false);
        return;
      }
    }
    onAnswer(true);
    setIsTrue(true);
  }

  return (
    <div className={`Question${isTrue === true ? ' Title__true' : (isTrue === false ? ' Title__false' : '')}`}>
      <div className={`Title`}>
        {questionSplitted.map((x, index) => (
        <>
          {x}
          {index < questionSplitted.length - 1 ? <>{' '}{<input disabled={isTrue === false} onChange={e => setValues((prev) => {
            const t = [...prev];
            t[index] = e.target.value.toLowerCase();
            return t;
          })}/>}</>: ''}
        </>
      ))}</div>
      <button disabled={isTrue === false} onClick={onSubmit}>ОК</button>
    </div>
  );
};

export default memo(BlanksAnswer);