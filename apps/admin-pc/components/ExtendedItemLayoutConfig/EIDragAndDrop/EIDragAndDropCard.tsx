import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import styled from 'styled-components';

import { Color } from '../../../../core/styles';

export const ItemTypes = {
  CARD: 'card',
};

const CardBox = styled.div<{ disabled?: boolean; isDragging?: boolean }>`
  border: 1px solid ${Color.border1};
  color: ${({ disabled }) => (disabled ? Color.disable : Color.primary)};
  border-radius: 4px;
  padding: 8px 12px;
  margin-right: 8px;
  background-color: ${({ disabled }) =>
    disabled ? Color.background : Color.base};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'move')};
  opacity: ${({ isDragging }) => (isDragging ? '0' : '1')};
  width: 26%;
`;

export interface CardProps {
  disabled: boolean;
  id: string;
  text: string;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
}

export interface Item {
  type: string;
  id: string;
  originalIndex: [number, number];
  text: string;
}

export const Card: React.FC<CardProps> = ({
  disabled,
  id,
  text,
  moveCard,
  findCard,
}) => {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, originalIndex, text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !disabled,
    end: (item: any, monitor) => {
      const { id: droppedId, originalIndex } = item;
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveCard(droppedId, originalIndex);
      }
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => false,
    hover({ id: draggedId }: Item) {
      if (draggedId !== id) {
        const { index: overIndex } = findCard(id);
        moveCard(draggedId, overIndex);
      }
    },
  });
  return (
    <CardBox
      ref={(node) => drag(drop(node))}
      disabled={disabled}
      isDragging={isDragging}
    >
      {text}
    </CardBox>
  );
};
