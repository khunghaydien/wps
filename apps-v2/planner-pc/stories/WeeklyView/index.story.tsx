import React, { ReactElement } from 'react';

import { parse } from 'date-fns';
import moment from 'moment';

import { action } from '@storybook/addon-actions';

import { CoreProvider } from '../../../core';

import reducer, { actions } from '../../modules/entities/events';

import WeeklyViewContainer from '../../containers/WeeklyViewContainer';

import { withProvider } from '../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import events from './events';

const store = configureStore({
  // @ts-ignore
  entities: {
    events: reducer(
      {},
      actions.fetchSuccess(
        events,
        parse('2018-11-25T00:00:00.000Z'),
        parse('2019-01-06T00:00:00.000Z')
      )
    ),
  },
  selectedDay: moment('2018/12/19'),
});

export default {
  title: 'planner-pc/WeeklyView',
  decorators: [
    withProvider(store),
    (story: Function) => <CoreProvider>{story()}</CoreProvider>,
  ],
};

export const December192018 = (): ReactElement => (
  <div style={{ height: 'calc(100vh)' }}>
    <WeeklyViewContainer
      openEventEdit={action('Open event edit popup')}
      today={new Date(2018, 11, 19, 7, 30)}
    />
  </div>
);

December192018.storyName = 'December 19 2018';
