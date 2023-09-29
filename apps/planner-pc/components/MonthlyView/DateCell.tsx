import React, { SyntheticEvent } from 'react';

import { format, isSaturday, isSunday } from 'date-fns';

import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import CalendarUtil from '../../../commons/utils/CalendarUtil';
import { Text } from '../../../core';
import { Color } from '../../../core/styles';

import DailySummaryTriggerContainer from '../../containers/DailySummaryTriggerContainer';

import { Color as PlannerColor } from '../../styles';

type Props = Readonly<{
  className?: string;
  date: Date;
  today?: boolean;
  inactive?: boolean;
  useWorkTime?: boolean;
  /**
   * for debugging i18n
   */
  locale?: string;
  onClick?: (e: SyntheticEvent) => void;
}>;

const theme = {
  today: css`
    color: ${PlannerColor.todayText};
    background: ${PlannerColor.today};
  `,
  sunday: css`
    color: ${PlannerColor.sunday};
  `,
  saturday: css`
    color: ${PlannerColor.saturday};
  `,
  inactive: css`
    color: #999;
  `,
};

const Block = styled.div<{
  date: Date;
  inactive?: boolean;
  today?: boolean;
  useWorkTime?: boolean;
}>`
  background: #fff;
  ${({ date }): FlattenSimpleInterpolation =>
    isSaturday(date) && theme.saturday};
  ${({ date }): FlattenSimpleInterpolation => isSunday(date) && theme.sunday};
  ${({ inactive }): FlattenSimpleInterpolation => inactive && theme.inactive};
  ${({ today }): FlattenSimpleInterpolation => today && theme.today};
  border: 1px solid ${Color.border1};
  border-left: none;
  border-top: none;

  :first-child {
    border-left: 1px solid ${Color.border1};
  }

  width: 100%;
  min-height: 112px;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;

  :hover {
    cursor: ${({ useWorkTime }): string =>
      useWorkTime ? 'pointer' : 'default'};
    background: ${Color.hover};
  }
`;

const TextDate = styled(Text)<{
  date: Date;
  inactive?: boolean;
  today?: boolean;
}>`
  ${({ date }): FlattenSimpleInterpolation =>
    isSaturday(date) && theme.saturday};
  ${({ date }): FlattenSimpleInterpolation => isSunday(date) && theme.sunday};
  ${({ inactive }): FlattenSimpleInterpolation => inactive && theme.inactive};
  ${({ today }): FlattenSimpleInterpolation => today && theme.today};
  width: 100%;
  height: 20px;
  padding: 4px;
  margin: 4px 0 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  background: none;
`;

export default (props: Props): React.ReactElement => {
  const testId = format(props.date, 'YYYYMMDD');
  return (
    <Block as={DailySummaryTriggerContainer} {...props} data-testid={testId}>
      <TextDate size="medium" {...props}>
        {props.date.getDate() === 1
          ? CalendarUtil.format(
              props.date,
              {
                month: 'short',
                day: 'numeric',
              },
              props.locale
            )
          : CalendarUtil.format(
              props.date,
              {
                day: 'numeric',
              },
              props.locale
            )}
      </TextDate>
    </Block>
  );
};
