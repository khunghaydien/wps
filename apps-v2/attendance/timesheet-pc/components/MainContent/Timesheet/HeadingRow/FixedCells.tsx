import React from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import msg from '@commons/languages';

import modifierCssClassName from '../helpers/modifierCssClassName';
import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from '../TimesheetViewType';
import zIndex from '../zIndex';
import ROOT from './root';

const FixedCell = styled.th<{ type: TimesheetViewType }>`
  ${({ type }) =>
    type === TIMESHEET_VIEW_TYPE.TABLE
      ? `
      position: sticky;
      top: 0;
      z-index: ${zIndex.headerLeft};
      `
      : ''}
`;

const Cell = styled.th<{ type: TimesheetViewType }>`
  ${({ type }) =>
    type === TIMESHEET_VIEW_TYPE.TABLE
      ? `
      position: sticky;
      top: 0;
      z-index: ${zIndex.header};
      `
      : ''}
`;

const FixedCells: React.FC<{
  type: TimesheetViewType;
  useManageCommuteCount?: boolean;
  useAllowanceManagement?: boolean;
  useFixDailyRequest?: boolean;
  useWorkTime?: boolean;
}> = ({
  type,
  useManageCommuteCount,
  useAllowanceManagement,
  useFixDailyRequest,
  useWorkTime,
}) => {
  const fixedCellCssClassName = React.useCallback(
    (baseClassName: string) =>
      classNames(
        baseClassName,
        modifierCssClassName(baseClassName, type, {
          useFixDailyRequest,
        })
      ),
    [type, useFixDailyRequest]
  );

  return (
    <>
      {useFixDailyRequest && (
        <FixedCell
          type={type}
          key="fix-daily-request"
          className={fixedCellCssClassName(`${ROOT}__col-fix-daily-request`)}
        />
      )}
      <FixedCell
        type={type}
        key="status"
        className={fixedCellCssClassName(`${ROOT}__col-status`)}
      />
      <FixedCell
        type={type}
        key="application"
        className={fixedCellCssClassName(`${ROOT}__col-application`)}
      >
        {msg().Att_Lbl_Request}
      </FixedCell>
      <FixedCell
        type={type}
        key="date"
        className={fixedCellCssClassName(`${ROOT}__col-date`)}
      >
        {msg().Att_Lbl_Date}
      </FixedCell>
      <FixedCell
        type={type}
        key="start-time"
        className={fixedCellCssClassName(`${ROOT}__col-start-time`)}
      >
        {msg().Att_Lbl_TimeIn}
      </FixedCell>
      <FixedCell
        type={type}
        key="end-time"
        className={fixedCellCssClassName(`${ROOT}__col-end-time`)}
      >
        {msg().Att_Lbl_TimeOut}
      </FixedCell>
      {useAllowanceManagement && (
        <Cell
          type={type}
          key="daily-allowance"
          className={`${ROOT}__col-daily-allowance`}
        >
          {msg().Att_Lbl_Allowance}
        </Cell>
      )}
      {useManageCommuteCount && (
        <Cell
          type={type}
          key="commute-count"
          className={`${ROOT}__col-commute-count`}
        >
          {msg().Att_Lbl_CommuteCountCommute}
        </Cell>
      )}
      {useWorkTime && (
        <Cell type={type} className={`${ROOT}__col-time-tracking`}>
          {msg().Att_Lbl_TimeTrack}
        </Cell>
      )}
    </>
  );
};

FixedCells.defaultProps = {
  useAllowanceManagement: false,
  useFixDailyRequest: false,
  useManageCommuteCount: false,
  useWorkTime: false,
};

export default FixedCells;
