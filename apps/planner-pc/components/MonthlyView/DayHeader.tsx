import React from 'react';

import take from 'lodash/take';

import styled from 'styled-components';

import CalendarUtil from '../../../commons/utils/CalendarUtil';
import { Text } from '../../../core';
import { Color } from '../../../core/styles';

type Props = Readonly<{
  className?: string;
  dates: ReadonlyArray<Date>;
  /*
   * for debugging locale
   */
  locale?: string;
}>;

const Block = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 24px;
  min-height: 24px;
`;

const DayText = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-transform: uppercase;
  color: #666;
  background: #fafafa;
  border: 1px solid ${Color.border1};
  border-left: none;

  :first-child {
    border-left: 1px solid ${Color.border1};
  }
`;

const Days: React.FC<Props> = (props: Props) => (
  <Block {...props}>
    {take(props.dates, 7).map((date) => (
      <DayText>
        {CalendarUtil.format(date, { weekday: 'short' }, props.locale)}
      </DayText>
    ))}
  </Block>
);

export default Days;
