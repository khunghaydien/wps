import * as React from 'react';

import styled from 'styled-components';

import { Color, Font } from '../../../core/styles';

type Props = {
  currentTime: Date;
  locale: string | null;
};

const StampDate = styled.p`
  font-size: ${Font.size.XL};
  text-align: center;
`;

const StampTime = styled.p`
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  color: ${Color.main};

  > span {
    animation: Flash 1s step-end infinite;
  }

  @keyframes Flash {
    50% {
      opacity: 0;
    }
  }
`;

const StampClockContainer = styled.div`
  padding-top: 8px;
  padding-bottom: 16px;
`;

const StampClock = (props: Props) => {
  const currentTime = props.currentTime;
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  };
  return (
    <StampClockContainer>
      <StampDate>
        {currentTime.toLocaleDateString(props.locale || 'ja', options)}
      </StampDate>
      <StampTime>
        {`0${currentTime.getHours()}`.slice(-2)}
        <span>:</span>
        {`0${currentTime.getMinutes()}`.slice(-2)}
      </StampTime>
    </StampClockContainer>
  );
};

export default StampClock;
