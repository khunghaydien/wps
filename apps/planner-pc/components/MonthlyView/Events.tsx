import * as React from 'react';
import { ReactElement } from 'react';

import { isSameWeek } from 'date-fns';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import maxBy from 'lodash/fp/maxBy';
import groupBy from 'lodash/groupBy';

import styled, { css, FlattenInterpolation } from 'styled-components';

import { WEEK_START_ON } from '../../constants/calendar';

import Tooltip from '../../../commons/components/Tooltip';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import { LinkButton } from '../../../core';

import {
  EventViewModel,
  State as EventMap,
  toKey,
} from '../../modules/entities/events';

import {
  doesHiddenEventsExist,
  filterByWeek,
  isVisibleAllDayEvent,
  makeAllDayEventLayout,
} from '../../helpers';
import Event from './Event';
import WeekRow from './WeekRow';

type Props = Readonly<{
  weekDates: ReadonlyArray<Date>;
  events: EventMap;
  visibleEventsNumber: number;
  onClickOpenEvent: (id: string, e: React.MouseEvent) => void;
  onClickOpenEventList: (date: Date, e: React.MouseEvent) => void;
}>;

const invisibleEventWidth = css`
  width: 100%;
`;

const visibleEventWidth = css<{
  periodOfWeek: number;
  internalEndDateTime: Date;
  date: Date;
  isOverMultipleWeeks: boolean;
}>`
  width: calc(
    ${({ periodOfWeek }): number => periodOfWeek * 100}% +
      ${({ periodOfWeek }): number => (periodOfWeek - 1) * 4}px -
      ${({ internalEndDateTime, date, isOverMultipleWeeks }): number =>
        !isSameWeek(internalEndDateTime, date, WEEK_START_ON) &&
        isOverMultipleWeeks
          ? 0
          : 8}px
  );
`;

const AbsoluteRow: React.ComponentType<{
  top?: number;
  periodOfWeek: number;
  internalEndDateTime: Date;
  date: Date;
  isOverMultipleWeeks: boolean;
}> = styled.div<{ top?: number } & EventViewModel>`
  position: absolute;
  top: ${({ top = 0 }): number => top}em;
  left: 0;
  font-size: 20px;
  padding: 0;
  margin: 0 8px 0 2px;
  ${(
    e
  ): FlattenInterpolation<{
    periodOfWeek: number;
    internalEndDateTime: Date;
    date: Date;
    isOverMultipleWeeks: boolean;
  }> => (isVisibleAllDayEvent(e) ? visibleEventWidth : invisibleEventWidth)};
`;

const HiddenRow = styled.div`
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  font-size: 0;
  overflow: hidden;
  white-space: nowrap;
  width: 1px;
`;

const VisibleRow = styled.div<{ top?: number } & EventViewModel>`
  position: absolute;
  top: ${({ top = 0 }): number => top}em;
  left: 0;
  font-size: 20px;
  padding: 0;
  margin: 0 8px 0 2px;
  ${(
    e
  ): FlattenInterpolation<{
    periodOfWeek: number;
    internalEndDateTime: Date;
    date: Date;
    isOverMultipleWeeks: boolean;
  }> => (isVisibleAllDayEvent(e) ? visibleEventWidth : invisibleEventWidth)};
`;

const Row: React.ComponentType<{
  top?: number;
  children: React.ReactNode;
}> = styled(AbsoluteRow)`
  width: unset;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 2;
`;

const WeekEventRow = styled(WeekRow)`
  margin: 24px 0 0 0;
`;

const Block = styled.div`
  position: relative;
  outline: none;
  appearance: none;
  width: 100%;
  height: 100%;
  flex: 1 1 0%;
`;

const StyledLinkButton = styled(LinkButton)`
  padding: 1px 0 2px 7px;
`;

const Events: React.FC<Props> = ({
  events,
  weekDates,
  visibleEventsNumber,
  onClickOpenEventList,
  onClickOpenEvent,
  ...props
}: Props) => {
  const es = filterByWeek(events, weekDates);
  const layout = makeAllDayEventLayout(es);
  const eventMap: {
    // @ts-ignore FIXME Use toKey utility to generate key properly.
    [K in Date]: Array<EventViewModel>;
  } = groupBy(es, (e) => e.date);

  const topOfTail = (date: Date): number => {
    const e = flow(
      filter((event: EventViewModel) => layout[event.id] < visibleEventsNumber),
      maxBy((event) => layout[event.id])
      // @ts-ignore FIXME Use toKey utility to generate key properly.
    )(eventMap[date] || []);
    const top = e ? layout[e.id] + 1 : 0;
    return Math.min(top, visibleEventsNumber);
  };

  return (
    <WeekEventRow
      weekDates={weekDates}
      render={({ date }): ReactElement => (
        <Block key={date.toISOString()} tabIndex={0} {...props}>
          <div role="presentation">
            {/* @ts-ignore FIXME Use toKey utility to generate key properly. */}
            {(eventMap[date] || []).map((event) => {
              const Presentation =
                layout[event.id] < visibleEventsNumber ? VisibleRow : HiddenRow;
              return (
                <Presentation
                  key={event.id}
                  top={layout[event.id]}
                  {...event}
                  role="presentation"
                >
                  <Event
                    {...event}
                    id={`${date.toISOString()}-${event.id || ''}`}
                    assistive={
                      !(
                        isVisibleAllDayEvent(event) &&
                        layout[event.id] < visibleEventsNumber
                      )
                    }
                    onClick={(e): void => onClickOpenEvent(event.id, e)}
                  />
                </Presentation>
              );
            })}
            {doesHiddenEventsExist(
              // @ts-ignore FIXME Use toKey utility to generate key properly.
              eventMap[date],
              layout,
              visibleEventsNumber
            ) && (
              <Row top={topOfTail(date)}>
                <Tooltip
                  id={date.toISOString()}
                  align="top left"
                  content={msg().Cal_Lbl_SeePlans}
                  style={{ fontSize: '10px' }}
                >
                  <StyledLinkButton
                    tabIndex={0}
                    size="small"
                    onClick={(e): void => onClickOpenEventList(date, e)}
                  >
                    {TextUtil.nl2br(
                      TextUtil.template(
                        msg().Cal_Lbl_Plans,
                        (events[toKey(date)] || []).length
                      )
                    )}
                  </StyledLinkButton>
                </Tooltip>
              </Row>
            )}
          </div>
        </Block>
      )}
    />
  );
};

export default Events;
