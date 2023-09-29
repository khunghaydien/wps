/* eslint-disable import/no-extraneous-dependencies */

import React, { ReactElement } from 'react';

import styled from 'styled-components';

import { CoreProvider } from '../../../../core';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import DateRow from '../DateRow';

// @ts-ignore
const store = configureStore({});

const Box = styled.div`
  height: 112px;
  width: 112px;
`;

export default {
  title: 'planner-pc/MonthlyView/parts/DateRow',

  decorators: [
    withProvider(store),
    (story: Function): ReactElement => <CoreProvider>{story()}</CoreProvider>,
    (story: Function): ReactElement => <Box>{story()}</Box>,
  ],
};

export const Default = (): ReactElement => (
  <DateRow
    weekDates={[
      new Date(2019, 8, 1),
      new Date(2019, 8, 2),
      new Date(2019, 8, 3),
      new Date(2019, 8, 4),
      new Date(2019, 8, 5),
      new Date(2019, 8, 6),
      new Date(2019, 8, 7),
    ]}
    today={new Date(2019, 8, 4)}
    month={8}
  />
);

Default.storyName = 'default';

export const Boundary = (): ReactElement => (
  <DateRow
    weekDates={[
      new Date(2019, 8, 29),
      new Date(2019, 8, 30),
      new Date(2019, 9, 1),
      new Date(2019, 9, 2),
      new Date(2019, 9, 3),
      new Date(2019, 9, 4),
      new Date(2019, 9, 5),
    ]}
    today={new Date(2019, 9, 2)}
    month={8}
  />
);
