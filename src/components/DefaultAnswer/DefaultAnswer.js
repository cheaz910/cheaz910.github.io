import { useState, useEffect, memo } from 'react';

import './styles.css';

const DefaultAnswer = ({question, trueAnswer, id, onAnswer, answers}) => {
  const [selected, setSelected] = useState('');

  return (
    <div className="Question">
      <div className="Title">{question}</div>
      <div className="Answers">
        {answers.map((answer, index) => (
          <div key={index} className={`Answer${answer === selected && selected === trueAnswer ? ' Answer__true' : (selected !== '' && answer === selected ? ' Answer__false' : '')}`}>
            <input 
              disabled={selected !== ''} 
              onChange={() => {
                setSelected(answer);
                if (answer === trueAnswer) {
                  onAnswer(true);
                } else {
                  onAnswer(false);
                }
              }} 
              id={`${id}-answer-${index}`} 
              name={`${id}-answer`} 
              type="radio" 
            />
            <label htmlFor={`${id}-answer-${index}`}>{answer}</label>
          </div>
        ))}
      </div>
    </div>
  );
};