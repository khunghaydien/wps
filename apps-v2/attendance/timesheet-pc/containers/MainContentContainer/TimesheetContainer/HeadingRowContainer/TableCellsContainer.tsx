import * as React from 'react';
import { useSelector } from 'react-redux';

import {
  LAYOUT_ITEM_TYPE,
  SYSTEM_ITEM_NAME,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import { State } from '@attendance/timesheet-pc/modules';

import Component from '@attendance/timesheet-pc/components/MainContent/Timesheet/HeadingRow/TableCells';

const TableCellsContainer: React.FC = () => {
  const origLayoutHead = useSelector(
    (state: State) => state.ui.dailyRecordDisplayFieldLayout.layoutRow
  );
  const useFixDailyRequest = useSelector(
    (state: State) => state.entities.timesheet.workingType.useFixDailyRequest
  );

  let layoutHead = origLayoutHead;
  if (!useFixDailyRequest) {
    layoutHead = layoutHead?.filter(
      (item) =>
        !(
          item.type === LAYOUT_ITEM_TYPE.ACTION &&
          item.objectItemName === SYSTEM_ITEM_NAME.DAILY_FIX_REQUEST_BUTTON
        )
    );
  }

  return <Component layoutHead={layoutHead} />;
};

export default TableCellsContainer;
