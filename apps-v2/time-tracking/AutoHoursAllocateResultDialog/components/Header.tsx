import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import defaultPermission from '../../../domain/models/access-control/Permission';

import { OpenAutoHoursAllocateDictDialogButton } from '@apps/time-tracking/AutoHoursAllocateDictDialog/';

const TableHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  height: 60px;
  padding: 0 16px;
  border-bottom: solid 1px #d8dde6;
  background: #f4f6f9;
  border-radius: 4px 4px 0 0;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;
  color: #53688c;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
`;

const TableOfTimes = styled.table`
  width: auto;
  margin-right: 16px;

  th {
    text-align: left;
    font-weight: normal;
  }

  td {
    padding-left: 5px;
  }
`;

type Props = {
  empId: string;
  targetDate: string;
  timeOfAttendance: number | null | undefined;
  timeOfExternalTaskTime: number | null;
  selectedTime: number | null;
};

const Header: React.FC<Props> = ({
  empId,
  targetDate,
  timeOfAttendance,
  timeOfExternalTaskTime,
  selectedTime,
}) => {
  const formattedTimeTracking = React.useMemo(
    () => TimeUtil.toHHmm(timeOfExternalTaskTime + selectedTime),
    [timeOfExternalTaskTime, selectedTime]
  );
  const formattedExternalTaskTime = React.useMemo(
    () => TimeUtil.toHHmm(timeOfExternalTaskTime || 0),
    [timeOfExternalTaskTime]
  );
  const formattedAttendance = React.useMemo(
    () => TimeUtil.toHHmm(timeOfAttendance || 0),
    [timeOfAttendance]
  );
  const formattedSelectedTime = React.useMemo(() => {
    return TimeUtil.toHHmm(selectedTime);
  }, [selectedTime]);

  return (
    <TableHeaderWrapper>
      <HeaderTitle>
        {msg().Time_Lbl_AutomaticWorkingHoursAllocation}
      </HeaderTitle>
      <TableOfTimes>
        <tbody>
          <tr>
            <th>{msg().Trac_Lbl_TimeOfAttendance}</th>
            <td>{`: ${formattedAttendance}`}</td>
          </tr>
          <tr>
            <th>{msg().Time_Lbl_TrackedTotal}</th>
            <td>{`: ${formattedTimeTracking}`}</td>
          </tr>
          <tr>
            <th>{msg().Time_Lbl_AutomaticHoursAllocation}</th>
            <td>{`: ${formattedSelectedTime}/${formattedExternalTaskTime}`}</td>
          </tr>
        </tbody>
      </TableOfTimes>
      <OpenAutoHoursAllocateDictDialogButton
        appearance="button"
        color="primary"
        targetDate={targetDate}
        userPermission={defaultPermission}
        empId={empId}
      />
    </TableHeaderWrapper>
  );
};

export default Header;
