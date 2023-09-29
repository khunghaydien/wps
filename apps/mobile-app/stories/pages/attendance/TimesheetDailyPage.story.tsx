import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, withKnobs } from '@storybook/addon-knobs';

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
    withInfo,
  ],
};

export const TimesheetDailyPage = () => (
  <Component
    currentDate="2018-10-10"
    isEditable={boolean('isEditable', true)}
    record={record}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeRestTimeStartTime={action('onChangeRestTimeStartTime')}
    onChangeRestTimeEndTime={action('onChangeRestTimeEndTime')}
    onClickRemoveRestTime={action('onClickRemoveRestTime')}
    onClickAddRestTime={action('onClickAddRestTime')}
    onChangeOtherRestTime={action('onChangeOtherRestTime')}
    onChangeRemarks={action('onChangeRemarks')}
    onClickSave={action('onClickSave')}
    onChangeCommuteCount={action('onChangeCommuteCount')}
  />
);

TimesheetDailyPage.parameters = {
  info: {
    inline: false,
    text: `
      勤務表
    `,
  },
};
