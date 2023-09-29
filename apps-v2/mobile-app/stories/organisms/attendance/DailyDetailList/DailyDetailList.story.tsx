import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import { WorkingType } from '@attendance/domain/models/WorkingType';

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
    contractedDetail={props.contractedDetail}
    readOnly={boolean('readOnly', false)}
    isShowOtherRestTime={boolean('isShowOtherRestTime', false)}
    onChangeCommuteCount={action('onChangeCommuteCount')}
    onChangeStartTime={action('onChangeStartTime')}
    onChangeEndTime={action('onChangeEndTime')}
    onChangeRestTime={action('onChangeRestTime')}
    onClickAddRestTime={action('onClickAddRestTime')}
    onClickRemoveRestTime={action('onClickRemoveRestTime')}
    onChangeOtherRestTime={action('onChangeOtherRestTime')}
    onChangeRemarks={action('onChangeRemarks')}
    restTimeReasons={[
      {
        id: '00',
        code: '00',
        name: '00',
      },
    ]}
    otherRestReason={{
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    }}
    commuteCount={{
      forwardCount: number(
        'commuteForwardCount',
        props.commuteCount.forwardCount
      ),
      backwardCount: number(
        'commuteBackwardCount',
        props.commuteCount.backwardCount
      ),
    }}
    workingType={
      {
        useRestReason: true,
        useManageCommuteCount: true,
      } as WorkingType
    }
    onChangeOtherRestReason={action('onChangeOtherRestReason')}
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
