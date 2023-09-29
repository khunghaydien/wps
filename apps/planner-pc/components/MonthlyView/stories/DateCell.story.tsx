/* eslint-disable import/no-extraneous-dependencies */

import React, { ReactElement } from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { CoreProvider } from '../../../../core';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import DateCell from '../DateCell';

// @ts-ignore
const store = configureStore({});

const Box = styled.div`
  height: 112px;
  width: 112px;
`;

export default {
  title: 'planner-pc/MonthlyView/parts/DateCell',

  decorators: [
    withProvider(store),
    (story: Function): ReactElement => <CoreProvider>{story()}</CoreProvider>,
    (story: Function): ReactElement => <Box>{story()}</Box>,
  ],
};

export const Default = (): ReactElement => (
  <DateCell date={new Date(2019, 8, 4)} onClick={action('onClick')} />
);

Default.storyName = 'default';

export const Sunday = (): ReactElement => (
  <DateCell date={new Date(2019, 8, 8)} onClick={action('onClick')} />
);

export const Saturday = (): ReactElement => (
  <DateCell date={new Date(2019, 8, 21)} onClick={action('onClick')} />
);

export const Today = (): ReactElement => (
  <DateCell date={new Date(2019, 8, 15)} today onClick={action('onClick')} />
);

export const StartDateOfMonth = (): ReactElement => (
  <DateCell date={new Date(2019, 10, 1)} onClick={action('onClick')} />
);

StartDateOfMonth.storyName = 'Start Date of Month';
