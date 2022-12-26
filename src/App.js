import { useState, useCallback, useEffect } from 'react';

import './App.css';
import Question from './components/Question/Question';
import BlanksAnswer from './components/BlanksAnswer/BlanksAnswer';
import InputAnswer from './components/InputAnswer/InputAnswer';
import MultipleAnswer from './components/MultipleAnswer/MultipleAnswer';
import ImageAnswer from './components/ImageAnswer/ImageAnswer';
import MatchAnswer from './components/MatchAnswer/MatchAnswer';
import data from './pm02.json';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

function App() {
  const [count, setCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const onAnswer = useCallback((isTrue) => setCount(prev => prev + +isTrue), []);

  useEffect(() => {
    setQuestions(data.questions.sort(() => Math.random() - 0.5).map(x => ({...x, answers: x.answers ? x.answers.sort(() => Math.random() - 0.5) : undefined})))
  }, [data]);
  console.log(data);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h4>Не хватает вопросов с изображением и соответствиями</h4>
        {questions.map((x, index) => (
          <div key={x.question} className="QuestionContainer">
            {x.type === "blanks" ? 
              <BlanksAnswer onAnswer={onAnswer} id={index} question={x.question} trueAnswer={x.trueAnswer} />
            : (
              x.type === undefined ?
                <Question onAnswer={onAnswer} id={index} question={x.question} answers={x.answers} trueAnswer={x.trueAnswer} />
              :
              x.type === "input" ?
                <InputAnswer hint={x.hint} onAnswer={onAnswer} id={index} question={x.question} trueAnswer={x.trueAnswer} />
              :
              x.type === "multiple" ?
                <MultipleAnswer hint={x.hint} onAnswer={onAnswer} id={index} question={x.question} answers={x.answers} trueAnswer={x.trueAnswer} />
              :
              x.type === "image" ?
                <ImageAnswer onAnswer={onAnswer} id={index} name={x.name} answers={x.answers} trueAnswer={x.trueAnswer} />
              :
                ''
            )}
          </div>
        ))}
        <div className="Counter">{`Правильно ${count} из ${data.questions.length}`}</div>
      </div>
      <MatchAnswer />
    </DndProvider>
  );
}

export default App;
