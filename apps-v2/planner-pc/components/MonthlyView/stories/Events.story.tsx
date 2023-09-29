/* eslint-disable import/no-extraneous-dependencies */

import React, { ReactElement } from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import styled from 'styled-components';

import { Event } from '../../../../domain/models/time-management/Event';

import reducer, { actions } from '../../../modules/entities/events';

import Events from '../Events';

const Box = styled.div`
  padding: 5em;
  width: 50em;
`;

const events: {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
}[] = [
  {
    id: '1',
    title: 'Event A',
    startDateTime: new Date(2019, 9, 10),
    endDateTime: new Date(2019, 9, 29),
  },
  {
    id: '2',
    title: 'Event B',
    startDateTime: new Date(2019, 9, 28),
    endDateTime: new Date(2019, 9, 29),
  },
  {
    id: '3',
    title: 'Event C',
    startDateTime: new Date(2019, 9, 29),
    endDateTime: new Date(2019, 10, 2),
  },
  {
    id: '4',
    title: 'Event D',
    startDateTime: new Date(2019, 9, 30),
    endDateTime: new Date(2019, 9, 31),
  },
  {
    id: '5',
    title: 'Event D',
    startDateTime: new Date(2019, 8, 30),
    endDateTime: new Date(2019, 9, 1),
  },
  {
    id: '6',
    title: 'Event G-1',
    startDateTime: new Date(2019, 10, 1, 10, 30),
    endDateTime: new Date(2019, 10, 1, 12, 30),
  },
  {
    id: '7',
    title: 'Event H',
    startDateTime: new Date(2019, 10, 2),
    endDateTime: new Date(2019, 10, 2),
  },
  {
    id: '8',
    title: 'Event E',
    startDateTime: new Date(2019, 9, 27),
    endDateTime: new Date(2019, 10, 2),
  },
  {
    id: '9',
    title: 'Event F',
    startDateTime: new Date(2019, 9, 27),
    endDateTime: new Date(2019, 9, 27),
  },
  {
    id: '10',
    title: 'Event G-2',
    startDateTime: new Date(2019, 10, 1, 10, 30),
    endDateTime: new Date(2019, 10, 2, 10, 30),
  },
  {
    id: '11',
    title: 'Event I',
    startDateTime: new Date(2019, 9, 27),
    endDateTime: new Date(2019, 9, 28, 10, 30),
  },
];

const eventMap = reducer(
  {},
  actions.fetchSuccess(
    events.map(
      (e: any): Event => ({
        ...e,
        startDateTime: e.startDateTime.toISOString(),
        endDateTime: e.endDateTime.toISOString(),
      })
    ),
    new Date(2019, 9, 1),
    new Date(2019, 10, 4)
  )
);

export default {
  title: 'planner-pc/MonthlyView/parts/Events',
  decorators: [
    withKnobs,
    (story: Function): ReactElement => <Box>{story()}</Box>,
  ],
};

export const Default = (): ReactElement => (
  <Events
    visibleEventsNumber={3}
    events={eventMap}
    weekDates={[
      new Date(2019, 9, 27),
      new Date(2019, 9, 28),
      new Date(2019, 9, 29),
      new Date(2019, 9, 30),
      new Date(2019, 9, 31),
      new Date(2019, 10, 1),
      new Date(2019, 10, 2),
    ]}
    onClickOpenEvent={action('onClickOpenEvent')}
    onClickOpenEventList={action('onClickOpenEventList')}
  />
);

Default.storyName = 'default';
