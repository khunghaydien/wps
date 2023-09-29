import React from 'react';

import styled from 'styled-components';

import Container from './EIDragAndDropContainer';

export type Card = { id: string; text: string };
export type Cards = Array<Card>;
export type EILayout = Array<Cards>;

const ListContainer = styled.div`
  width: 100%;
`;

type Props = {
  disabled: boolean;
  items: EILayout;
  config: Record<string, any>;
  onChangeDetailItem: (key: string, value: Array<any>) => void;
};

const EIDragAndDrop = ({
  disabled,
  items,
  config,
  onChangeDetailItem,
}: Props) => {
  return (
    <ListContainer>
      {items.map((row, index) => (
        <Container
          disabled={disabled}
          layout={items}
          row={row}
          rowIndex={index}
          key={index}
          config={config}
          onChangeDetailItem={onChangeDetailItem}
        />
      ))}
    </ListContainer>
  );
};

export default EIDragAndDrop;
