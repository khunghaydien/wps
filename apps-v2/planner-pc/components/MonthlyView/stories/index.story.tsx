/* eslint-disable import/no-extraneous-dependencies */

import React, { ReactElement } from 'react';

import { action } from '@storybook/addon-actions';
import { createGlobalStyle } from 'styled-components';

import { CoreProvider } from '../../../../core';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import MonthlyView from '../index';
import case1 from './mocks/event.case1';
import case2 from './mocks/event.case2';
import case3 from './mocks/event.case3';
import case4 from './mocks/event.case4';

// @ts-ignore
const store = configureStore({});

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'planner-pc/MonthlyView',

  decorators: [
    withProvider(store),
    (story: Function): ReactElement => <CoreProvider>{story()}</CoreProvider>,
    (story: Function): ReactElement => (
      <>
        <GlobalStyle />
        {story()}
      </>
    ),
  ],
};

export const December2018 = (): ReactElement => (
  <MonthlyView
    today={new Date(2018, 11, 15)}
    date={new Date(2018, 11, 20)}
    events={case4}
    useWorkTime
    onClickNewEvent={action('onClickNewEvent')}
    onClickOpenEvent={action('onClickOpenEvent')}
    onClickOpenEventList={action('onClickOpenEventList')}
  />
);

export const December2019 = (): ReactElement => (
  <MonthlyView
    today={new Date(2019, 11, 30)}
    date={new Date(2019, 11, 1)}
    events={case1}
    useWorkTime
    onClickNewEvent={action('onClickNewEvent')}
    onClickOpenEvent={action('onClickOpenEvent')}
    onClickOpenEventList={action('onClickOpenEventList')}
  />
);

export const January2020 = (): ReactElement => (
  <MonthlyView
    today={new Date(2020, 0, 30)}
    date={new Date(2020, 0, 17)}
    events={case2}
    useWorkTime
    onClickNewEvent={action('onClickNewEvent')}
    onClickOpenEvent={action('onClickOpenEvent')}
    onClickOpenEventList={action('onClickOpenEventList')}
  />
);

export const February2020 = (): ReactElement => (
  <MonthlyView
    today={new Date(2020, 1, 15)}
    date={new Date(2020, 1, 28)}
    events={case3}
    useWorkTime
    onClickNewEvent={action('onClickNewEvent')}
    onClickOpenEvent={action('onClickOpenEvent')}
    onClickOpenEventList={action('onClickOpenEventList')}
  />
);
