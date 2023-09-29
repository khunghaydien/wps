import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import CalendarUtil from '@commons/utils/CalendarUtil';

import { toClosestMinutes } from '@apps/daily-summary/helper';

type Props = {
  date?: Date;
};

const Container = styled.div<{ top: number }>`
  display: flex;
  align-items: center;
  position: absolute;
  width: calc(100% - 55px);
  top: ${(props) => props.top}px;
  left: 55px;
`;

const Circle = styled.div`
  border-radius: 50%;
  width: 8px;
  height: 8px;
  position: absolute;
  left: -4px;
  background-color: #c23934;
`;

const Line = styled.div`
  border: 1px solid #c23934;
  width: 100%;
`;

const useElapsedMinutesOfDay = (date: Date = new Date()) => {
  const [minutes, setMinutes] = useState<number>(
    toClosestMinutes(CalendarUtil.getElapsedMinutesOfDay(date))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setMinutes(toClosestMinutes(CalendarUtil.getElapsedMinutesOfDay()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return minutes;
};

const TimeHorizontalRule: FC<Props> = ({ date }) => {
  const minutes = useElapsedMinutesOfDay(date);

  return (
    <Container top={minutes}>
      <Circle />
      <Line />
    </Container>
  );
};

export default TimeHorizontalRule;
