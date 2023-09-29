import React from 'react';

import styled from 'styled-components';

import DisplayFieldLayoutItemTable from '../DisplayFieldLayoutItemTable';
import attRecordList from './mock-data/attRecordList';
import dailyRequestConditionsMap from './mock-data/dailyRequestConditionsMap';
import {
  layoutRow,
  layoutValues,
} from './mock-data/displayFieldLayoutItemList';

export default {
  title:
    'attendance/timesheet-pc/MainContent/Timesheet/DisplayFieldLayoutItemTable',
};

const Wrapper = styled.div`
  thead {
    border-bottom: 1px solid #d8dde6;
  }
`;

export const Default = () => (
  <Wrapper>
    <DisplayFieldLayoutItemTable
      isLoading={false}
      attRecordList={attRecordList}
      isManHoursGraphOpened={true}
      dailyRequestConditionsMap={dailyRequestConditionsMap}
      layoutRow={layoutRow}
      layoutValues={layoutValues}
    />
  </Wrapper>
);
