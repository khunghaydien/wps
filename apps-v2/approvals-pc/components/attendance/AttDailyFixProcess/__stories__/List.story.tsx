import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import styled from 'styled-components';

import { Content, FilterBar, ToolBar } from './mocks/components/list.mock';

import Component from '../List';

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess/List',
  decorators: [withKnobs],
};

export const Default = (): React.ReactNode => (
  <Component
    ToolBar={ToolBar}
    FilterBar={FilterBar}
    Content={Content.Default as React.FC}
  />
);

const ComponentWithScroll = styled.div`
  height: 500px;
  overflow: hidden;
`;

export const WithScroll = (): React.ReactNode => (
  <ComponentWithScroll>
    <Component
      ToolBar={ToolBar}
      FilterBar={FilterBar}
      Content={Content.WithScroll as React.FC}
    />
  </ComponentWithScroll>
);
