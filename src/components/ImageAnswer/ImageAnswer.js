import { useState, useEffect, memo } from 'react';

import './styles.css';

function ImageAnswer({onAnswer, id, name, answers, trueAnswer}) {
  const [selected, setSelected] = useState('');

  return (
    <div className="Question">
      <div className="Title"><img src={require(`../../images/${name}`)} /></div>
      <div className="Answers">
        {answers.map((answer, index) => (
          <div key={index} className={`Answer${selected !== '' && answer === trueAnswer ? ' Answer__true' : (answer === selected ? ' Answer__false' : '')}`}>
            <input 
              disabled={selected !== ''} 
              onChange={() => {
                setSelected(answer);
                onAnswer(answer === trueAnswer);
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
}

export default memo(ImageAnswer);
