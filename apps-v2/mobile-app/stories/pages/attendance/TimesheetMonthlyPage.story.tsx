import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';

import { WorkingType } from '@apps/attendance/domain/models/WorkingType';
import STATUS from '@apps/domain/models/approval/request/Status';
import {
  ACTIONS_FOR_FIX,
  detectPerformableActionForFix,
} from '@attendance/domain/models/AttFixSummaryRequest';

import storeMock from '@apps/attendance/timesheet-pc/components/__stories__/mock-data/storeMock';
import $TimesheetMonthlyPage from '@mobile/components/pages/attendance/TimesheetMonthlyPage';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import { items as records } from '../../organisms/attendance/MonthlyList/meta';
import configureStore from '@mobile/store/configureStore';

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

export default {
  title: 'Components/pages/attendance',
  decorators: [withKnobs(), withProvider(store)],
};

const workingTypes = [
  {
    startDate: '2018-10-01',
    endDate: '2018-10-01',
    useFixDailyRequest: false,
  },
] as unknown as WorkingType[];

export const TimesheetMonthlyPage = (): React.ReactNode => {
  const status = select(
    'status',
    {
      NotRequested: STATUS.NotRequested,
      Pending: STATUS.Pending,
      Approved: STATUS.Approved,
      Reject: STATUS.Rejected,
      Recalled: STATUS.Recalled,
      Canceled: STATUS.Canceled,
    },
    STATUS.NotRequested
  );
  return (
    <$TimesheetMonthlyPage
      workingTypes={workingTypes}
      useFixDailyRequest={false}
      currentDate="2018-10-10"
      yearMonthOptions={[
        { value: '2018-09-01', label: '2018-09' },
        { value: '2018-10-01', label: '2018-10' },
        { value: '2018-11-01', label: '2018-11' },
      ]}
      // @ts-ignore
      records={records}
      attendanceRequest={{
        summaryId: '',
        requestId: '',
        comment: '',
        status,
        performableActionForFix: detectPerformableActionForFix(status),
      }}
      historyList={[
        {
          id: '0001',
          stepName: 'Step Name',
          approveTime: '2020-01-01 00:00',
          status: 'Approved',
          statusLabel: 'Approved',
          approverName: 'Approver Name',
          actorName: 'Actor Name',
          actorPhotoUrl: 'https://photo',
          comment: 'comment',
          isDelegated: false,
        },
      ]}
      onChangeMonth={action('onChangeMonth')}
      onClickMonthlyListItem={action('onClickMonthlyListItem')}
      onClickRefresh={action('onClickRefresh')}
      onClickPrevMonth={action('onClickPrevMonth')}
      onClickNextMonth={action('onClickNextMonth')}
      onClickSendAttendanceRequest={action('onClickSendAttendanceRequest')}
      onChangeAttendanceRequestComment={action(
        'onChangeAttendanceRequestComment'
      )}
    />
  );
};

export const TimesheetMonthlyPageNoFooter = (): React.ReactNode => (
  <$TimesheetMonthlyPage
    workingTypes={workingTypes}
    useFixDailyRequest={false}
    currentDate="2018-10-10"
    yearMonthOptions={[
      { value: '2018-09-01', label: '2018-09' },
      { value: '2018-10-01', label: '2018-10' },
      { value: '2018-11-01', label: '2018-11' },
    ]}
    // @ts-ignore
    records={records}
    attendanceRequest={{
      summaryId: '',
      requestId: '',
      status: STATUS.Approved,
      comment: '',
      performableActionForFix: ACTIONS_FOR_FIX.None,
    }}
    historyList={[
      {
        id: '0001',
        stepName: 'Step Name',
        approveTime: '2020-01-01 00:00',
        status: 'Approved',
        statusLabel: 'Approved',
        approverName: 'Approver Name',
        actorName: 'Actor Name',
        actorPhotoUrl: 'https://photo',
        comment: 'comment',
        isDelegated: false,
      },
    ]}
    onChangeMonth={action('onChangeMonth')}
    onClickMonthlyListItem={action('onClickMonthlyListItem')}
    onClickRefresh={action('onClickRefresh')}
    onClickPrevMonth={action('onClickPrevMonth')}
    onClickNextMonth={action('onClickNextMonth')}
    onClickSendAttendanceRequest={action('onClickSendAttendanceRequest')}
    onChangeAttendanceRequestComment={action(
      'onChangeAttendanceRequestComment'
    )}
  />
);
