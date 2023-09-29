import * as React from 'react';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/List';

import ContentContainer from './ContentContainer';
import FilterBarContainer from './FilterBarContainer';
import ToolBarContainer from './ToolBarContainer';

const ListContainer: React.FC = () => (
  <Component
    ToolBar={ToolBarContainer}
    FilterBar={FilterBarContainer}
    Content={ContentContainer}
  />
);

export default ListContainer;
