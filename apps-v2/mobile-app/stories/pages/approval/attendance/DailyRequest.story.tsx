import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '@apps/domain/models/approval/request/Status';
import { REQUEST_TYPE } from '@attendance/domain/models/approval/AttDailyRequestDetail';

import Component from '@mobile/components/pages/approval/attendance/DailyRequest';

export default {
  title: 'Components/pages/approval/attendance',
  decorators: [withKnobs],
};

export const DailyRequest = (): React.ReactNode => (
  <Component
    request={{
      request: {
        id: '0001',
        status: STATUS.Approved,
        employeeName: 'Employee Name',
        employeePhotoUrl: 'employee-photo-url',
        delegatedEmployeeName: 'Delegated Employee Name',
        comment: 'Comment',
        typeLabel: 'typeLabel',
        remarks: 'Remarks ',
        type: REQUEST_TYPE.Absence,
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        reason: 'Reason',
      },
      originalRequest: {
        id: '0001',
        status: STATUS.Approved,
        employeeName: 'Employee Name',
        employeePhotoUrl: 'employee-photo-url',
        delegatedEmployeeName: 'Delegated Employee Name',
        comment: 'Comment',
        typeLabel: 'typeLabel',
        remarks: 'Remarks ',
        type: REQUEST_TYPE.Absence,
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        reason: 'Reason',
      },
      historyList: [
        {
          id: 'historyId',
          stepName: 'Step Name',
          approveTime: '2020-01-03 07:30',
          status: STATUS.Approved,
          statusLabel: 'Status Label',
          approverName: 'Approver Name',
          actorName: 'Actor Name',
          actorPhotoUrl: 'actor-photo-url',
          comment: 'History Comment',
          isDelegated: false,
          actorId: 'actorId',
          isPending: false,
        },
      ],
    }}
    detailList={[
      {
        label: 'label1',
        value: 0,
        originalValue: 1,
      },
      {
        label: 'label2',
        value: '2020-01-01',
        valueType: 'date',
        originalValue: '2020-01-02',
      },
      {
        label: 'label3',
        value: '2020-01-01 00:00',
        valueType: 'datetime',
        originalValue: '2020-01-01 12:00',
      },
      {
        label: 'label4',
        value: 'text1',
        valueType: 'text',
        originalValue: 'text2',
      },
      {
        label: 'label5',
        value: 'text text text text text text text',
        valueType: 'longtext',
        originalValue: 'abc abc abc abc abc abc abc abc abc abc abc abc abc',
      },
    ]}
    comment={text('comment', 'comment')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickBack={action('onClickBack')}
  />
);
