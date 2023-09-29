import * as React from 'react';
import { useSelector } from 'react-redux';

import { State } from '@mobile/modules';

import Component from '@mobile/components/organisms/attendance/AttendanceRequestIgnoreWarningConfirm';

const AttendanceRequestIgnoreWarningConfirmContainer: React.FC = () => {
  const warning = useSelector(
    (state: State) => state.attendance.attendanceRequest.warning
  );

  return <Component {...warning} />;
};

export default AttendanceRequestIgnoreWarningConfirmContainer;
