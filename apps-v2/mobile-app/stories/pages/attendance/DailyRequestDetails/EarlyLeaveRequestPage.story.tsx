import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import EarlyLeaveRequestPage from '../../../../components/pages/attendance/DailyRequestDetails/EarlyLeaveRequestPage';

import store from '../store.mock';

const earlyLeaveReasonList = [
  {
    id: 'a172v00000deeEvAAI',
    name: '早退理由テスト1',
    code: 'testCode001',
    earlyLeaveEndTime: 300,
  },
  {
    id: 'a172v00000deeEvAA3',
    name: '早退理由テスト2',
    code: 'testCode002',
    earlyLeaveEndTime: 360,
  },
];

const selectedEarlyLeaveReason = {
  id: 'a172v00000deeEvAAI',
  name: '早退理由テスト1',
  code: 'testCode001',
  earlyLeaveEndTime: 300,
};

export default {
  title: 'Components/pages/attendance/DailyRequestDatails',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
  ],
};

export const _EarlyLeaveRequestPage = () => (
  <EarlyLeaveRequestPage
    isLeavingOffice={boolean('isLeavingOffice', false)}
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.EarlyLeave,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.EarlyLeave,
      requestTypeName: text('requestTypeName', 'EarlyLeave'),
      startDate: text('startDate', '2018-01-01'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', ''),
    }}
    isFlexWithoutCoreNoWorkingTime={boolean(
      'isFlexWithoutCoreNoWorkingTime',
      false
    )}
    validation={{}}
    earlyLeaveReasonOptions={[]}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReason={action('onChangeReason')}
    onChangePersonalReason={action('onChangePersonalReason')}
  />
);
_EarlyLeaveRequestPage.storyName = 'EarlyLeaveRequestPage';

export const _EarlyLeaveRequestPageForFlexWithoutCoreNoWorkingTime = () => (
  <EarlyLeaveRequestPage
    isLeavingOffice={false}
    readOnly={false}
    request={{
      ...defaultValue,
      type: CODE.EarlyLeave,
      // @ts-ignore
      status: STATUS.NotRequested,
      requestTypeCode: CODE.EarlyLeave,
      requestTypeName: 'EarlyLeave',
      startDate: '2018-01-01',
      startTime: 0,
      endTime: 0,
      remarks: '',
      isFlexWithoutCore: false,
      useManagePersonalReason: true,
      personalReason: true,
    }}
    isFlexWithoutCoreNoWorkingTime={true}
    isFlexWithoutCore={true}
    personalReasonEarlyLeaveEndTime={0}
    objectiveReasonEarlyLeaveEndTime={0}
    validation={{}}
    earlyLeaveReasonOptions={[]}
    selectedEarlyLeaveReason={null}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReason={action('onChangeReason')}
    onChangePersonalReason={action('onChangePersonalReason')}
    onChangeReasonId={action('onChangeReasonId')}
    onChangeRemarks={action('onChangeRemarks')}
  />
);
_EarlyLeaveRequestPageForFlexWithoutCoreNoWorkingTime.storyName =
  'EarlyLeaveRequestPageForFlexWithoutCoreNoWorkingTime';

export const _EarlyLeaveRequestPageForFlexWithoutCore = () => (
  <EarlyLeaveRequestPage
    isLeavingOffice={false}
    readOnly={false}
    request={{
      ...defaultValue,
      type: CODE.EarlyLeave,
      // @ts-ignore
      status: STATUS.NotRequested,
      requestTypeCode: CODE.EarlyLeave,
      requestTypeName: 'EarlyLeave',
      startDate: '2018-01-01',
      startTime: 0,
      endTime: 0,
      remarks: '',
      isFlexWithoutCore: false,
      useManagePersonalReason: true,
      personalReason: true,
    }}
    isFlexWithoutCoreNoWorkingTime={false}
    isFlexWithoutCore={true}
    personalReasonEarlyLeaveEndTime={420}
    objectiveReasonEarlyLeaveEndTime={480}
    validation={{}}
    earlyLeaveReasonOptions={[]}
    selectedEarlyLeaveReason={null}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReason={action('onChangeReason')}
    onChangePersonalReason={action('onChangePersonalReason')}
    onChangeReasonId={action('onChangeReasonId')}
    onChangeRemarks={action('onChangeRemarks')}
  />
);
_EarlyLeaveRequestPageForFlexWithoutCore.storyName =
  '_EarlyLeaveRequestPageForFlexWithoutCore';

export const EarlyLeaveRequestPageForUseEarlyLeaveReason = () => (
  <EarlyLeaveRequestPage
    isLeavingOffice={boolean('isLeavingOffice', false)}
    readOnly={boolean('readOnly', false)}
    request={{
      ...defaultValue,
      type: CODE.EarlyLeave,
      // @ts-ignore
      status: text('state', STATUS.NotRequested),
      requestTypeCode: CODE.EarlyLeave,
      requestTypeName: text('requestTypeName', 'EarlyLeave'),
      startDate: text('startDate', '2022-12-28'),
      startTime: number('startTime', 0),
      endTime: number('endTime', 0),
      remarks: text('remarks', 'テスト'),
      reasonId: 'a172v00000deeEvAAI',
      reasonCode: '早退理由テスト1',
      reasonName: 'testCode001',
      useEarlyLeaveReason: true,
    }}
    validation={{}}
    earlyLeaveReasonOptions={earlyLeaveReasonList.map(({ id, name }) => ({
      label: name,
      value: id,
    }))}
    selectedEarlyLeaveReason={selectedEarlyLeaveReason}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeReason={action('onChangeReason')}
    onChangePersonalReason={action('onChangePersonalReason')}
    onChangeReasonId={action('onChangeReasonId')}
    onChangeRemarks={action('onChangeRemarks')}
  />
);
EarlyLeaveRequestPageForUseEarlyLeaveReason.storyName =
  'EarlyLeaveRequestPageForUseEarlyLeaveReason';
