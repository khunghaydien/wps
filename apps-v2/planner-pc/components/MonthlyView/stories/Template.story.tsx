/* eslint-disable import/no-extraneous-dependencies */

import React, { ReactElement } from 'react';

import { createGlobalStyle } from 'styled-components';

import CalendarUtil from '../../../../commons/utils/CalendarUtil';

import Template from '../Template';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'planner-pc/MonthlyView/parts',

  decorators: [
    (story: Function): ReactElement => (
      <>
        <GlobalStyle />
        {story()}
      </>
    ),
  ],
};

export const _Template = (): ReactElement => (
  <Template dates={CalendarUtil.getCalendarAsOf(new Date(2019, 10, 23))} />
);
