import React from 'react';

import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import { HOURS_HEIGHT_ON_WEEKLY_CALENDAR as HOURS_HEIGHT } from '../../constants/calendar';

const EventCard: React.ComponentType<{ isEditing?: boolean }> = styled.div<{
  isEditing?: boolean;
}>`
  background: #006dcc;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  padding: 4px 0 0 4px;
  word-break: break-word;
  overflow: hidden;
  ${({ isEditing }): FlattenSimpleInterpolation =>
    isEditing &&
    css`
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    `}
`;

type AllDayEventProps = Readonly<{
  row: number;
  column: number;
  span: number;
  readonly?: boolean;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}>;

export const AllDayEvent = styled(EventCard).attrs<AllDayEventProps>(
  ({ row, column, span }) => ({
    style: {
      gridRow: `${row} / span 1`,
      gridColumn: `${column} / span ${span}`,
    },
  })
)<AllDayEventProps>`
  border: none;
  margin: 0 8px 2px 2px;
  padding-right: 4px;
  text-overflow: ellipsis;
  ${({ readonly }): FlattenSimpleInterpolation =>
    !readonly &&
    css`
      &:hover {
        background: #004b99;
      }
      cursor: pointer;
    `}
`;

type EventProps = Readonly<{
  top: number;
  height: number;
  left: number;
  width: number;
  readonly?: boolean;
  hasJob?: boolean;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}>;

export const Event = styled(EventCard).attrs<EventProps>(
  ({ top, height, left, width }) => ({
    style: {
      top,
      height: height - 3,
      left,
      width,
    },
  })
)<EventProps>`
  position: absolute;
  border: 1px solid #fff;
  ${({ height }): FlattenSimpleInterpolation =>
    height >= HOURS_HEIGHT &&
    css`
      display: flex;
      flex-direction: column;
    `}

  ${({ height }): FlattenSimpleInterpolation =>
    height > 8 &&
    css`
      margin: 1px 8px 2px 2px;
      padding-left: 8px;
      padding-top: 4px;
    `}

  ${(props): FlattenSimpleInterpolation =>
    !props.readonly &&
    css`
      &:hover {
        background: ${props.hasJob ? '#004b99' : '#f3f2f2'};
      }
      cursor: pointer;
    `}

  ${(props): FlattenSimpleInterpolation =>
    !props.hasJob &&
    css`
      border: 1px solid #006dcc;
      background: #fff;
      color: #006dcc;
    `}
`;
