import * as React from 'react';

import styled from 'styled-components';

import arrowLeft from '../assets/icons-generic/arrow-left.svg';
import arrowRight from '../assets/icons-generic/arrow-right.svg';
import arrow from '../assets/icons-generic/arrow.svg';
import attention from '../assets/icons-generic/attention.svg';
import calendar from '../assets/icons-generic/calendar.svg';
import check from '../assets/icons-generic/check.svg';
import clock from '../assets/icons-generic/clock.svg';
import close from '../assets/icons-generic/close.svg';
import edit from '../assets/icons-generic/edit.svg';
import externalLink from '../assets/icons-generic/external-link.svg';
import locked from '../assets/icons-generic/locked.svg';
import percent from '../assets/icons-generic/percent.svg';
import plus from '../assets/icons-generic/plus.svg';
import refresh from '../assets/icons-generic/refresh.svg';
import search from '../assets/icons-generic/search.svg';
import deleteIcon from '../assets/icons/delete.svg';
import { Color } from '../styles';

const IconSize = {
  medium: 16,
  large: 32,
};

interface Props {
  'data-testid'?: string;
  color?: keyof typeof Color;
  size?: keyof typeof IconSize;
}

export type IconType = React.ComponentType<Props>;

const S = {
  Icon: styled.svg<Props>`
    fill: ${({ color = 'primary' }): string => Color[color]};
    height: ${({ size = 'medium' }): number => IconSize[size]}px;
    width: ${({ size = 'medium' }): number => IconSize[size]}px;
    padding: 0;
    margin: 0;
  `,
};

const icon =
  (iconEntity: React.ComponentType<Props>): IconType =>
  (props: Props): React.ReactElement =>
    <S.Icon as={iconEntity} aria-hidden {...props} />;

export const Arrow = icon(arrow);
export const ChevronLeft = icon(arrowLeft);
export const ChevronRight = icon(arrowRight);
export const Attention = icon(attention);
export const Calendar = icon(calendar);
export const Check = icon(check);
export const Clock = icon(clock);
export const Close = icon(close);
export const Percent = icon(percent);
export const Plus = icon(plus);
export const Search = icon(search);
export const Delete = icon(deleteIcon);
export const ExternalLink = icon(externalLink);
export const Edit = icon(edit);
export const Locked = icon(locked);
export const Refresh = icon(refresh);
