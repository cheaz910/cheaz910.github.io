import { useState, useEffect, memo, useCallback } from 'react';
import update from 'immutability-helper'

import './styles.css';

import { useDrag, useDrop } from 'react-dnd'

export const ItemTypes = {
  BOX: 'box',
}

const style1 = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'black',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
  margin: '5px',
  borderRadius: '5px',
  boxShadow: '0px 0px 8px 0px rgba(34, 60, 80, 0.2)'
}
export const Dustbin = memo(({value, lastDroppedItem, onDrop}) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.BOX],
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  const isActive = canDrop && isOver
  return (
    <div ref={drop} style={{ ...style1 }} data-testid="dustbin">
      {value}
      
      {lastDroppedItem && (
        <p>Ответ: {lastDroppedItem.name}</p>
      )}
    </div>
  )
});

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}
export const Box = memo(function Box({ name, isDropped }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
      {isDropped ? <s>{name}</s> : name}
    </div>
  )
});


function MatchAnswer({first, second, question, trueAnswer, onAnswer}) {
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [dustbins, setDustbins] = useState(first.sort(() => Math.random() - 0.5).map(x => ({ value: x, lastDroppedItem: null })));
  const [boxes] = useState(second.sort(() => Math.random() - 0.5).map(x => ({ name: x, type: ItemTypes.BOX })));
  const [isTrue, setIsTrue] = useState();
  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1
  }
  const handleDrop = useCallback(
    (index, item) => {
      const { name } = item;
      const indexInDustbins = dustbins.findIndex(x => x.lastDroppedItem && x.lastDroppedItem.name === name);
      setDroppedBoxNames((prev) => {
        if (indexInDustbins > -1) {
          return prev.filter(y => y !== dustbins[indexInDustbins].value)
        } else {
          const x = [...prev];
          const findIndex = x.findIndex(y => y === name);
          if (findIndex === -1) return [...x, name];
          return x;
        }
      })
      console.log(item);
      setDustbins((prev) => {
        const x = [...prev];
        const tIndex = dustbins.findIndex(e1 => e1.lastDroppedItem && e1.lastDroppedItem.name === name);
        if (tIndex > -1) {
          x[tIndex].lastDroppedItem = null;
        }
        x[index].lastDroppedItem = item;

        console.log(x);
        return x;
      }
      )
    },
    [droppedBoxNames, dustbins],
  )

  const onSubmit = () => {
      // check true or false
      for (let i = 0; i < dustbins.length; i++) {
        if (dustbins.lastDroppedItem === null) {
          return;
        }
      }
      for (let i = 0; i < first.length; i++) {
        const dustbin = dustbins.find(x => x.value === first[i])
        const t = trueAnswer.find(x => x[0] === first[i]);
        console.log('zzzzzzzzzzzzzzz', t, dustbin)
        if (!dustbin || !t) {
          setIsTrue();
          return;
        }
        if (dustbin.lastDroppedItem.name === t[1]) {
          continue;
        } else {
          console.log(dustbin, t);
          setIsTrue(false);
          onAnswer(false);
          return;
        }
      }
      setIsTrue(true);
      onAnswer(true);
      console.log(dustbins, trueAnswer);
  };

  return (
    <div className={`Question${isTrue === true ? ' Title__true' : (isTrue === false ? ' Title__false' : '')}`}>
      <div className="Title">{question}</div>
      <div className="Container">
        <div className="Dustbins" style={{ overflow: 'hidden', clear: 'both' }}>
          {dustbins.map(({ value, lastDroppedItem }, index) => (
            <Dustbin
              accept={[ItemTypes.BOX]}
              lastDroppedItem={lastDroppedItem}
              value={value}
              onDrop={(item) => handleDrop(index, item)}
              key={index}
            />
          ))}
        </div>
        <div className="Boxes" style={{ overflow: 'hidden', clear: 'both' }}>
          {boxes.map(({ name }, index) => (
            <Box
              name={name}
              isDropped={isDropped(name)}
              key={index}
            />
          ))}
        </div>
      </div>
      <button onClick={onSubmit}>OK</button>
      <span style={{color:'red', display: 'block'}}>В доке ответов не было, кто знает ответ - напишите</span>
    </div>
  );
}

export default memo(MatchAnswer);
