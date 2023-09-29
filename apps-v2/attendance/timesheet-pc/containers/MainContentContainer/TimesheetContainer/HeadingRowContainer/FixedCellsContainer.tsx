import * as React from 'react';
import { useSelector } from 'react-redux';

import { State } from '@attendance/timesheet-pc/modules';

import Component from '@attendance/timesheet-pc/components/MainContent/Timesheet/HeadingRow/FixedCells';
import { TIMESHEET_VIEW_TYPE } from '@attendance/timesheet-pc/components/MainContent/Timesheet/TimesheetViewType';

import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';

const FixedCellsContainer: React.FC = () => {
  const type = useSelector((state: State) => {
    const useViewTable = state.entities?.timesheet?.workingTypes?.some(
      (workType) => workType.attRecordDisplayFieldLayouts?.timesheet
    );
    const catchError = state.ui.dailyRecordDisplayFieldLayout.catchError;
    if (useViewTable && !catchError) {
      return TIMESHEET_VIEW_TYPE.TABLE;
    }
    return TIMESHEET_VIEW_TYPE.GRAPH;
  });
  const userSetting = useSelector((state: State) => state.common.userSetting);
  const workingType = useSelector(
    (state: State) => state.entities?.timesheet?.workingType
  );
  const allowedWorkType = useAccessControl({
    allowIfByEmployee: true,
    requireIfByDelegate: ['viewTimeTrackByDelegate'],
  });
  const useWorkTime = React.useMemo(
    () => userSetting.useWorkTime && allowedWorkType,
    [allowedWorkType, userSetting.useWorkTime]
  );

  return (
    <Component
      type={type}
      useAllowanceManagement={workingType.useAllowanceManagement}
      useFixDailyRequest={workingType.useFixDailyRequest}
      useManageCommuteCount={workingType.useManageCommuteCount}
      useWorkTime={useWorkTime}
    />
  );
};

export default FixedCellsContainer;
