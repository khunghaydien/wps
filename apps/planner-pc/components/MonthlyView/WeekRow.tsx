import * as React from 'react';

import styled from 'styled-components';

type Props = Readonly<{
  weekDates: ReadonlyArray<Date>;
  render: React.ComponentType<{
    date: Date;
  }>;
  role?: string;
}>;

const Layer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex: 1 1 0%;
`;

const Cell = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 4px 4px 0 0;
`;

export const RightAlign = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const LeftAlign = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const WeekRow: React.FC<Props> = ({ render, weekDates, ...props }: Props) => {
  const Com = render;
  return (
    <Layer {...props}>
      <Row>
        {weekDates.map((date) => (
          <Cell>
            <Com date={date} />
          </Cell>
        ))}
      </Row>
    </Layer>
  );
};

export default WeekRow;
