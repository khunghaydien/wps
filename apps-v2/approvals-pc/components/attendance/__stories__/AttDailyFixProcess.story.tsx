import React from 'react';

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import styled from 'styled-components';

import * as DetailParts from '../AttDailyFixProcess/__stories__/mocks/components/detail.mock';
import * as ListParts from '../AttDailyFixProcess/__stories__/mocks/components/list.mock';

import Component from '../AttDailyFixProcess';
import $Detail from '../AttDailyFixProcess/Detail';
import $List from '../AttDailyFixProcess/List';

const Detail = () => (
  <$Detail
    requestId={text('Detail.requestId', 'test')}
    Header={DetailParts.Header}
    Content={DetailParts.Content.Default as React.FC}
    HistoryTable={DetailParts.HistoryTable}
    ApprovalForm={DetailParts.ApprovalForm}
  />
);

const List: React.FC<{
  Content: React.FC;
}> = ({ Content }) => (
  <$List
    FilterBar={ListParts.FilterBar}
    ToolBar={ListParts.ToolBar}
    Content={Content}
  />
);

export default {
  title: 'approvals-pc/attendance/AttDailyFixProcess',
  decorators: [withKnobs],
};

export const OpenedDetail = (): React.ReactNode => (
  <Component
    openedDetail={boolean('openedDetail', true)}
    List={() => <List Content={ListParts.Content.Default as React.FC} />}
    Detail={Detail}
  />
);

export const NotOpenedDetail = (): React.ReactNode => (
  <Component
    openedDetail={false}
    List={() => <List Content={ListParts.Content.Default as React.FC} />}
    Detail={Detail}
  />
);

const ComponentWithScroll = styled(Component)`
  height: 500px;
  overflow: hidden;
`;

export const OpenedDetailWithScroll = (): React.ReactNode => (
  <ComponentWithScroll
    openedDetail={true}
    List={() => <List Content={ListParts.Content.WithScroll as React.FC} />}
    Detail={Detail}
  />
);

export const NotOpenedDetailWithScroll = (): React.ReactNode => (
  <ComponentWithScroll
    openedDetail={false}
    List={() => <List Content={ListParts.Content.WithScroll as React.FC} />}
    Detail={Detail}
  />
);
