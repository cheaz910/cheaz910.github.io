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


function MatchAnswer({onAnswer, id, question, answers, trueAnswer}) {
  const [droppedBoxNames, setDroppedBoxNames] = useState([])
  const [dustbins, setDustbins] = useState([
    { value: 'На чем основана работа дифференциально-трансформаторного преобразователя -', lastDroppedItem: null },
    { value: 'На чем основана работа реостатного преобразователя -', lastDroppedItem: null },
    { value: 'На чем основана работа ферродинамического преобразователя -', lastDroppedItem: null },
  ])
  const [boxes] = useState([
    { name: 'на изменении взаимной индуктивности обмоток', type: ItemTypes.BOX },
    { name: 'на изменении сопротивления при перемещении движка', type: ItemTypes.BOX },
    { name: 'на  изменении углового перемещения', type: ItemTypes.BOX },
  ])
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
        console.log('----', tIndex, name, dustbins);
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

  return (
    <div className={`Question`}>
      <div className="Title">{''}</div>
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
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
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {boxes.map(({ name }, index) => (
            <Box
              name={name}
              isDropped={isDropped(name)}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(MatchAnswer);
