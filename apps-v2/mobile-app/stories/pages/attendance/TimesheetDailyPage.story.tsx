import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import { WorkingType } from '@attendance/domain/models/WorkingType';

import Component from '../../../components/pages/attendance/TimesheetDailyPage';

import * as record from '../../organisms/attendance/DailyDetailList/meta';
import store from './store.mock';

export default {
  title: 'Components/pages/attendance',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
  ],
};

export const TimesheetDailyPage = () => (
  <Component
    currentDate="2018-10-10"
    isEditable={boolean('isEditable', true)}
    record={record}
    approvalHistories={[]}
    sourceRecord={null}
    lockedSummary={false}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeRestTime={action('onChangeRestTimes')}
    onClickAddRestTime={action('onClickAddRestTime')}
    onClickRemoveRestTime={action('onClickRemoveRestTime')}
    onChangeOtherRestTime={action('onChangeOtherRestTime')}
    onChangeCommuteCount={action('onChangeCommuteCount')}
    onChangeRemarks={action('onChangeRemarks')}
    onClickSave={action('onClickSave')}
    onClickCancel={action('onClickCancel')}
    onClickSaveAndRequest={action('onClickSaveAndRequest')}
    restTimeReasons={[
      {
        id: '00',
        code: '00',
        name: '00',
      },
    ]}
    workingType={
      {
        useFixDailyRequest: false,
        useRestReason: true,
        useManageCommuteCount: false,
      } as WorkingType
    }
    onChangeOtherRestReason={action('onChangeOtherRestReason')}
  />
);

TimesheetDailyPage.parameters = {
  info: {
    inline: false,
    text: `
      勤務表
    `,
  },
  restTimeReasons: {
    id: '00',
    code: '00',
    name: '00',
  },
};
