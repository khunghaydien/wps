import * as React from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import { REQUEST_TYPE } from '@apps/domain/models/approval/request/Request';

import Component from '@mobile/components/molecules/approval/ReportSummaryListItem';

import ImgSample from '../../images/sample.png';

export default {
  title: 'Components/molecules/approval',
  decorators: [withKnobs],
};

export const ReportAttFixSummary = (): React.ReactNode => (
  <Component
    report={{
      requestType: REQUEST_TYPE.ATTENDANCE_FIX,
      requestId: '00001',
      requestDate: '2022-01-01',
      subject: '勤務確定申請',
      employeeName: '申請者名',
      photoUrl: ImgSample,
      departmentName: '部署名',
      approverName: '承認者名',
      approverPhotoUrl: ImgSample,
      approverDepartmentName: '承認者部署名',
      targetMonth: '2022-01',
    }}
    decimalPlaces={0}
    symbol="$"
    onClick={() => {}}
    onCheck={() => {}}
    checked={false}
  />
);
