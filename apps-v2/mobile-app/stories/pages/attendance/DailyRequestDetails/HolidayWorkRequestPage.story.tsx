import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import msg from '../../../../../commons/languages';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '../../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';
import { SUBSTITUTE_LEAVE_TYPE } from '../../../../../domain/models/attendance/SubstituteLeaveType';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/HolidayWorkRequestPage';

import store from '../store.mock';

export default {
  title: 'Components/pages/attendance/DailyRequestDatails',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const HolidayWorkRequestPage = () => (
  // @ts-ignore
  <Component
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.HolidayWork,
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.HolidayWork,
      requestTypeName: text('requestTypeName', 'HolidayWork'),
      startDate: text('startDate', '2018-01-01'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      availableSubstituteLeaveTypeList: Object.keys(SUBSTITUTE_LEAVE_TYPE),
      substituteLeaveType: text(
        'substituteLeaveType',
        SUBSTITUTE_LEAVE_TYPE.Substitute
      ),
      substituteDate: text('substituteDate', '2018-01-01'),
      remarks: text('remarks', ''),
    }}
    typeOptions={[
      {
        label: msg().Att_Lbl_DoNotUseReplacementDayOff,
        value: SUBSTITUTE_LEAVE_TYPE.None,
      },
      {
        label: msg().Att_Lbl_Substitute,
        value: SUBSTITUTE_LEAVE_TYPE.Substitute,
      },
    ]}
    onChangeStartDate={action('onChangeStartDate')}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeSubstituteLeaveType={action('onChangeSubstituteLeaveType')}
    onChangeSubstituteDate={action('onChangeSubstituteDate')}
    onChangeRemarks={action('onChangeRemarks')}
    validation={{}}
  />
);

HolidayWorkRequestPage.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      休日出勤申請詳細画面
    `,
  },
};
