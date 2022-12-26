import { useState, useEffect, memo } from 'react';

import './styles.css';

function MultipleAnswer({onAnswer, id, question, answers, trueAnswer}) {
  const [selected, setSelected] = useState([]);
  const [isTrue, setIsTrue] = useState();

  const onSubmit = () => {
    for (let i = 0; i < trueAnswer.length; i++) {
      console.log(trueAnswer, selected, selected.some(x => x === trueAnswer[i]), trueAnswer[i])
      if (!selected.some(x => x === trueAnswer[i])) {
        setIsTrue(false);
        onAnswer(false);
        return;
      }
    }

    setIsTrue(true);
    onAnswer(true);
  };

  return (
    <div className={`Question${isTrue === true ? ' Title__true' : (isTrue === false ? ' Title__false' : '')}`}>
      <div className="Title">{question}</div>
      <div className="Answers">
        {answers.map((answer, index) => (
          <div key={index} className={`Answer${answer === selected && selected === trueAnswer ? ' Answer__true' : (selected !== '' && answer === selected ? ' Answer__false' : '')}`}>
            <input 
              disabled={isTrue !== undefined} 
              onChange={(e) => {
                if (e.target.checked) {
                  setSelected(prev => [...prev, answer]);
                } else {
                  setSelected(prev => prev.filter(y => y !== answer));
                }
              }} 
              id={`${id}-answer-${index}`} 
              name={`${id}-answer`} 
              type="checkbox" 
            />
            <label htmlFor={`${id}-answer-${index}`}>{answer}</label>
          </div>
        ))}
      </div>
      <button disabled={isTrue !== undefined} onClick={onSubmit}>OK</button>
    </div>
  );
}

export default memo(MultipleAnswer);
