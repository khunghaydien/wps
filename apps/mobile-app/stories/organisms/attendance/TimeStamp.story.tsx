import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import Component from '../../../components/organisms/attendance/TimeStamp';

export default {
  title: 'Components/organisms/attendance',
  decorators: [withKnobs, withInfo],
};

export const TimeStamp = () => (
  <Component
    timeLocale={text('locale', 'ja')}
    onClickStartStampButton={action('onClickStartStampButton')}
    onClickEndStampButton={action('onClickEndStampButton')}
    isEnableStartStamp={boolean('isEnableStartStamp', true)}
    isEnableEndStamp={boolean('isEnableEndStamp', true)}
    isEnableRestartStamp={boolean('isEnableRestartStamp', false)}
    // @ts-ignore
    defaultAction={text('defaultAction', 'in')}
    showLocationToggleButton={boolean('showLocationToggleButton', true)}
    onClickToggleButton={action('onClickToggleButton')}
    willSendLocation={boolean('willSendLocation', true)}
    fetchStatus={text('fetchStatus', 'Success')}
    locationFetchTime={number('locationFetchTime', 1541760572975)}
    latitude={number('latitude', 35.658581)}
    longitude={number('longitude', 139.745433)}
    comment={text('comment', 'Good morning!')}
    onChangeCommentField={action('onChangeCommentField')}
    onClickRefresh={action('onClickRefresh')}
    onChangeCommuteCount={action('onChangeCommuteCount')}
    commuteForwardCount={null}
    commuteBackwardCount={null}
    useManageCommuteCount={boolean('useManageCommuteCount', true)}
  />
);

TimeStamp.parameters = {
  info: {
    inline: false,
    text: `
      # Description
      勤怠打刻コンポーネント

      # Props
      - fetchStatus: 'Success' | 'Failure' | 'None'
      - defaultAction: 'in' | 'out' | 'rein'
    `,
  },
};
