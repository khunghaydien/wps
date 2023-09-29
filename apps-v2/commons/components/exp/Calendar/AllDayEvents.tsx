import React, { FC } from 'react';

import styled from 'styled-components';

import {
  ALL_DAY_EVENT_HEIGHT,
  MAX_ALL_DAY_EVENT,
} from '@commons/constants/exp/calendar';

import MoreLinkContainer from '@commons/containers/exp/CalendarMoreLinkContainer';
import msg from '@commons/languages';
import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';

import { AllDayEvent } from './EventCard';

type Props = {
  allDayEvents: BaseEvent[];
  allDayEventsCount: number;
  onClickEvent: (event: BaseEvent) => void;
};

const S = {
  Header: styled.div<{ maxRow: number }>`
    display: grid;
    grid-template-columns: 54px 1fr;
    ${({ maxRow }) =>
      maxRow > 0 &&
      `grid-template-rows: repeat(${maxRow}, ${ALL_DAY_EVENT_HEIGHT}px);`}
    min-height: 38px;
    border-bottom: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  `,
  AllDayLabel: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #ddd;
    grid-column: 1 / span 1;
    grid-row: 1 / span 5;
    color: #666;
  `,
  More: styled.div`
    display: flex;
    align-items: center;
    grid-column: 2 / span 1;
    grid-row: 4 / span 1;
    margin-left: 10px;
    width: fit-content;
    cursor: pointer;
  `,
};

const AllDayEvents: FC<Props> = (props) => {
  return (
    <S.Header maxRow={props.allDayEventsCount}>
      <S.AllDayLabel>{msg().Cal_Lbl_AllDay}</S.AllDayLabel>
      {props.allDayEvents.slice(0, MAX_ALL_DAY_EVENT).map((event, i) => (
        <AllDayEvent
          row={i + 1}
          key={event.id}
          onClick={() => props.onClickEvent(event)}
        >
          <span>{event.title || msg().Cal_Lbl_NoTitle}</span>
        </AllDayEvent>
      ))}
      {props.allDayEvents.length > MAX_ALL_DAY_EVENT && (
        <S.More>
          <MoreLinkContainer id="1" />
        </S.More>
      )}
    </S.Header>
  );
};

export default AllDayEvents;
