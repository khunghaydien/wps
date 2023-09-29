import React from 'react';
import { useDrop } from 'react-dnd';

import styled from 'styled-components';

import { Color } from '../../../../core/styles';

import { Cards, EILayout } from './EIDragAndDrop';
import { Card, Item, ItemTypes } from './EIDragAndDropCard';

const borderInactiveColor = 'transparent';
const borderActiveColor = Color.border1;

const CardRow = styled.div`
  width: 100%;
  margin-bottom: 2;
  display: flex;
  padding: 4px 0 4px 10px;
  border: 1px dashed;
`;

const EmptyRow = styled.div`
  width: 100%;
  height: 16px;
  margin-bottom: 2px;
  border: 1px dashed;
`;

type Props = {
  disabled: boolean;
  layout: EILayout;
  row: Cards;
  rowIndex: number;
  config: Record<string, any>;
  onChangeDetailItem: (key: string, value: Array<any>) => void;
};

export type ContainerState = {
  layoutState: EILayout;
  cards: Cards;
};

const EmptyArea = ({ rowIndex, newRow }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: Item) => {
      newRow(item.id, rowIndex);
      return { text: 'ROW' + rowIndex };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  const borderColor = isActive ? borderActiveColor : borderInactiveColor;
  return <EmptyRow ref={drop} style={{ borderColor }}></EmptyRow>;
};

const Container = ({
  disabled,
  layout,
  row,
  rowIndex,
  config,
  onChangeDetailItem,
}: Props) => {
  const cards = row;
  const updateLayout = (
    newLayout: Array<Array<{ id: string; text: string }>>
  ) => {
    const newEILayout = [];
    for (let i = 0; i < newLayout.length; i++) {
      const newEILayoutRow = [];
      for (let j = 0; j < newLayout[i].length; j++) {
        newEILayoutRow.push(newLayout[i][j].text);
      }
      newEILayout.push(newEILayoutRow);
    }
    onChangeDetailItem(config.key, newEILayout);
  };

  const findCard = (id: string) => {
    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      const cardRow = layout[rowIndex].filter((c) => `${c.id}` === id);
      if (cardRow.length) {
        const card = cardRow[0];
        return {
          card,
          index: [rowIndex, layout[rowIndex].indexOf(card)],
        };
      }
    }
  };

  const newRow = async (id: string, targetRowIndex: number) => {
    const { card, index: originalIndex } = findCard(id) as any;
    const newLayout: any = [];
    const insertedRow = [card];
    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      if (rowIndex !== originalIndex[0]) {
        newLayout.push(layout[rowIndex]);
      } else if (rowIndex === originalIndex[0]) {
        const newRow = layout[rowIndex];
        newRow.splice(originalIndex[1], 1);
        if (newRow.length) newLayout.push(newRow);
      }
    }
    const offset =
      layout[originalIndex[0]].length || originalIndex[0] > targetRowIndex
        ? 1
        : 0;
    setTimeout(
      () => newLayout.splice(targetRowIndex + offset, 0, insertedRow),
      0
    );
    setTimeout(() => updateLayout(newLayout), 0);
  };

  const moveCard = (id: string, atIndex: number) => {
    const { card, index: fromIndex } = findCard(id) as any;
    let newLayout = [] as any;
    if (fromIndex[0] === atIndex[0]) {
      for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
        if (rowIndex !== fromIndex[0]) {
          newLayout.push(layout[rowIndex]);
        } else {
          const newRow = layout[rowIndex];
          newRow.splice(fromIndex[1], 1);
          newRow.splice(atIndex[1], 0, card);
          newLayout.push(newRow);
        }
      }
    } else {
      newLayout = layout;
    }
    updateLayout(newLayout);
  };

  const dropCard = (id: string, targetRowIndex: number) => {
    const { card, index: originalIndex } = findCard(id) as any;
    if (originalIndex[0] !== targetRowIndex) {
      if (layout[targetRowIndex].length !== 3) {
        const newLayout: any = [];
        for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
          if (rowIndex !== originalIndex[0] && rowIndex !== targetRowIndex) {
            newLayout.push(layout[rowIndex]);
          } else if (rowIndex === originalIndex[0]) {
            const newRow = layout[rowIndex];
            newRow.splice(originalIndex[1], 1);
            if (newRow.length) newLayout.push(newRow);
          } else {
            const newRow = layout[rowIndex];
            newRow.push(card);
            newLayout.push(newRow);
          }
        }
        setTimeout(() => updateLayout(newLayout), 0);
      }
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: Item) => {
      dropCard(item.id, rowIndex);
      return { text: 'ROW' + rowIndex };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  const border = isActive ? borderActiveColor : borderInactiveColor;
  return (
    <>
      <CardRow ref={drop} style={{ borderColor: border }}>
        {cards.map((card) => (
          <Card
            disabled={disabled}
            key={card.id}
            id={`${card.id}`}
            text={card.text}
            moveCard={moveCard}
            findCard={findCard as any}
          />
        ))}
      </CardRow>
      <EmptyArea rowIndex={rowIndex} newRow={newRow} />
    </>
  );
};

export default Container;
