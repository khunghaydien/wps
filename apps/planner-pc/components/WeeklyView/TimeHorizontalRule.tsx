import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import CalendarUtil from '../../../commons/utils/CalendarUtil';

import { toClosestToWeeklyCalendarsMinutes as toClosestValue } from '../../helpers';

type Props = Readonly<{
  date: Date;
}>;

const Container = styled.div<{ top: number }>`
  display: flex;
  align-items: center;
  position: absolute;
  width: calc(100% - 55px);
  top: ${(props): number => props.top}px;
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

const useElapsedMinutesOfDay = (date: Date): number => {
  const [minutes, setMinutes] = useState(
    toClosestValue(CalendarUtil.getElapsedMinutesOfDay(date))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setMinutes(toClosestValue(CalendarUtil.getElapsedMinutesOfDay()));
    }, 1000);
    return (): void => clearInterval(id);
  }, []);

  return minutes;
};

const TimeHorizontalRule: React.FC<Props> = ({ date }: Props) => {
  const minutes = useElapsedMinutesOfDay(date);

  return (
    <Container top={minutes}>
      <Circle />
      <Line />
    </Container>
  );
};

export default TimeHorizontalRule;
