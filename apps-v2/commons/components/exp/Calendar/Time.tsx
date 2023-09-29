import React, { FC } from 'react';

import styled from 'styled-components';

import CalendarUtil from '@commons/utils/CalendarUtil';

type Props = {
  hour: number;
};

const S = {
  Time: styled.div.attrs<{ hour: number }>((props) => ({
    style: {
      gridColumn: `1 / span 1`,
      gridRow: `${props.hour} / span 1`,
    },
  }))<{ hour: number }>`
    display: flex;
    justify-content: center;
    position: relative;
  `,
  TimeText: styled.span`
    position: absolute;
    top: 44px;
    line-height: 13px;
    font-size: 10px;
    color: #666;
  `,
};

const Time: FC<Props> = ({ hour }) => {
  return (
    <S.Time hour={hour}>
      <S.TimeText>
        {CalendarUtil.format(new Date(new Date().getTime()).setHours(hour, 0), {
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h24',
        })}
      </S.TimeText>
    </S.Time>
  );
};

export default Time;
