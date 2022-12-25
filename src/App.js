import { useState, useCallback, useEffect } from 'react';

import './App.css';
import Question from './components/Question/Question';
import data from './questions.json';

function App() {
  const [count, setCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const onAnswer = useCallback((isTrue) => setCount(prev => prev + +isTrue), []);

  useEffect(() => {
    setQuestions(data.questions.sort(() => Math.random() - 0.5).map(x => ({...x, answers: x.answers.sort(() => Math.random() - 0.5)})))
  }, [data]);
  console.log(data);
  return (
    <div className="App">
      {questions.map((x, index) => (
        <div key={x.question} className="QuestionContainer">
          <Question onAnswer={onAnswer} id={index} question={x.question} answers={x.answers} trueAnswer={x.trueAnswer} />
        </div>
      ))}
      <div className="Counter">{`Правильно ${count} из ${data.questions.length}`}</div>
    </div>
  );
}

export default App;
