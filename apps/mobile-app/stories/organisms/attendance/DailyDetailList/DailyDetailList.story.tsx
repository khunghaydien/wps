import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../../components/organisms/attendance/DailyDetailList';

import * as props from './meta';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withKnobs, withInfo],
};

export const DailyDetailList = () => (
  <Component
    startTime={number('startTime', props.startTime)}
    endTime={number('endTime', props.endTime)}
    otherRestTime={number('otherRestTime', props.restHours)}
    restTimes={props.restTimes}
    remarks={text('remarks', props.remarks)}
    commuteForwardCount={props.commuteForwardCount}
    commuteBackwardCount={props.commuteBackwardCount}
    contractedDetail={props.contractedDetail}
    readOnly={boolean('readOnly', false)}
    isShowOtherRestTime={boolean('isShowOtherRestTime', false)}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeRestTimeStartTime={action('onChangeRestTimeStartTime')}
    onChangeRestTimeEndTime={action('onChangeRestTimeEndTime')}
    onClickRemoveRestTime={action('onClickRemoveRestTime')}
    onClickAddRestTime={action('onClickAddRestTime')}
    onChangeOtherRestTime={action('onChangeOtherRestTime')}
    onChangeRemarks={action('onChangeRemarks')}
    onChangeCommuteCount={action('onChangeCommuteCount')}
  />
);

DailyDetailList.parameters = {
  info: {
    inline: false,
    text: `
      勤務詳細
    `,
  },
};
