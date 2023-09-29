/* eslint-disable import/no-extraneous-dependencies */

import React, { ReactElement } from 'react';

import { text, withKnobs } from '@storybook/addon-knobs';

import CalendarUtil from '../../../../commons/utils/CalendarUtil';

import DayHeader from '../DayHeader';

export default {
  title: 'planner-pc/MonthlyView/parts/DayHeader',
  decorators: [withKnobs],
};

export const Default = (): ReactElement => (
  <DayHeader dates={CalendarUtil.getCalendarAsOf(new Date(2019, 8, 10))} />
);

Default.storyName = 'default';

export const Locale = (): ReactElement => (
  <DayHeader
    dates={CalendarUtil.getCalendarAsOf(new Date(2019, 8, 10))}
    locale={text('locale', 'en-GB')}
  />
);

Locale.storyName = 'locale';
