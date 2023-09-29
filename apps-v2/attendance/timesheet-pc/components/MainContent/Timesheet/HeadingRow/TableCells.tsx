import React from 'react';

import styled from 'styled-components';

import { DailyRecordDisplayFieldLayoutItem } from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import { ItemHeader } from '../DisplayFieldLayoutItemHeader';
import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from '../TimesheetViewType';

const Cell = styled.th<{ type: TimesheetViewType }>`
  ${({ type }) =>
    type === TIMESHEET_VIEW_TYPE.TABLE
      ? `
      position: sticky;
      top: 0;
      z-index: 2;
      `
      : ''}
`;

type Props = {
  layoutHead: DailyRecordDisplayFieldLayoutItem[];
};

const TableCells: React.FC<Props> = ({ layoutHead }) => {
  return (
    <>
      {layoutHead?.map((item) => (
        <Cell type={TIMESHEET_VIEW_TYPE.TABLE} key={item.id}>
          <ItemHeader item={item} />
        </Cell>
      ))}
      {/* 余白用 */}
      <Cell type={TIMESHEET_VIEW_TYPE.TABLE} key="empty" />
    </>
  );
};

export default TableCells;
