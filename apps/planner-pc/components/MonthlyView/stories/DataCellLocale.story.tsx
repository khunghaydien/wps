import * as React from 'react';
import { ReactElement } from 'react';

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
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
  title: 'planner-pc/MonthlyView/parts/DateCell/locale',

  decorators: [
    withProvider(store),
    (story): ReactElement => <CoreProvider>{story()}</CoreProvider>,
    (story): ReactElement => <Box>{story()}</Box>,
    withKnobs,
  ],
};

export const _Default = (): ReactElement => (
  <DateCell
    date={new Date(2019, 8, 4)}
    locale={text('locale', 'en-GB')}
    onClick={action('onClick')}
  />
);

_Default.storyName = 'default';

export const _Sunday = (): ReactElement => (
  <DateCell
    date={new Date(2019, 8, 8)}
    locale={text('locale', 'en-GB')}
    onClick={action('onClick')}
  />
);

export const _Saturday = (): ReactElement => (
  <DateCell
    date={new Date(2019, 8, 21)}
    locale={text('locale', 'en-GB')}
    onClick={action('onClick')}
  />
);

export const _Today = (): ReactElement => (
  <DateCell
    date={new Date(2019, 8, 15)}
    today
    locale={text('locale', 'en-GB')}
    onClick={action('onClick')}
  />
);

export const _StartDateOfMonth = (): ReactElement => (
  <DateCell
    date={new Date(2019, 10, 1)}
    locale={text('locale', 'en-GB')}
    onClick={action('onClick')}
  />
);

_StartDateOfMonth.storyName = 'Start Date of Month';
