import * as React from 'react';

import styled, { css } from 'styled-components';

import AlertIcon from '../../commons/AlertIcon';
import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';

import '@mobile/components/molecules/attendance/MonthlyList/MonthlyListItem.scss';
import $LinkListItem from '@mobile/components/atoms/LinkListItem';

import { colors, unit } from '@mobile/styles/variables';

const Container = styled.div<{ dayType: DayType }>`
  position: relative;
  ${({ dayType }) => {
    switch (dayType) {
      case DAY_TYPE.Workday:
        return css`
          background-color: #fff;
        `;
      case DAY_TYPE.Holiday:
        return css`
          background-color: ${colors.blue100};
        `;
      case DAY_TYPE.PreferredLegalHoliday:
        return css`
          background-color: ${colors.blue100};
        `;
      case DAY_TYPE.LegalHoliday:
        return css`
          background-color: ${colors.red100};
        `;
    }
  }}
`;

const LinkListItem = styled($LinkListItem)`
  &&& {
    height: 48px;
    box-sizing: border-box;
    .mobile-app-atoms-link-list-item__item {
      overflow: hidden;
    }
  }
`;

const StatusColumn = styled.div`
  min-width: ${unit.mediumSize};
  margin-right: ${unit.extraSmallSize};
`;

const DateColumn = styled.div`
  width: 100%;
  text-align: center;
  white-space: nowrap;
  &.month-day {
    width: 100%;
    text-align: right;
  }
  &.week-day {
    width: 100%;
    padding-left: ${unit.smallSize};
    text-align: left;
  }
`;

const StartTime = styled.div<{
  isModified: boolean;
}>`
  width: 100%;
  text-align: center;
  white-space: nowrap;
  ${(props) =>
    props.isModified
      ? css`
          text-decoration: underline;
        `
      : ''}
`;

const EndTime = styled.div<{
  isModified: boolean;
}>`
  width: 100%;
  text-align: center;
  white-space: nowrap;
  ${(props) =>
    props.isModified
      ? css`
          text-decoration: underline;
        `
      : ''}
`;

type Props = Readonly<{
  onClick?: () => void;
  dayType: DayType;
  date: string;
  startTime: number | null;
  endTime: number | null;
  startTimeModified: boolean;
  endTimeModified: boolean;
  attention: boolean;
}>;

const MonthlyListItem: React.FC<Props> = ({
  dayType,
  date,
  startTime,
  endTime,
  startTimeModified,
  endTimeModified,
  attention,
  onClick,
}) => {
  return (
    <Container dayType={dayType}>
      <LinkListItem onClick={onClick}>
        <StatusColumn>
          <div>{attention && <AlertIcon variant="attention" />}</div>
        </StatusColumn>
        <DateColumn>
          <div className={`month-day`}>{DateUtil.formatMD(date)}</div>
          <div className={`weekday`}>{DateUtil.formatW(date)}</div>
        </DateColumn>
        <StartTime isModified={startTimeModified}>
          {TimeUtil.toHHmm(startTime)}
        </StartTime>
        <EndTime isModified={endTimeModified}>
          {TimeUtil.toHHmm(endTime)}
        </EndTime>
      </LinkListItem>
    </Container>
  );
};

export default MonthlyListItem;
