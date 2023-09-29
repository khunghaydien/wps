import React from 'react';

import { action } from '@storybook/addon-actions';

import StampWidget from '../StampWidget';

export default {
  title: 'attendance/timesheet-pc/MainContent/StampWidget',
};

const today = new Date(2022, 1, 22, 9, 32, 0, 0);

Date.now = () => today.valueOf();

export const _StampWidget = () => {
  return (
    // @ts-ignore
    <StampWidget
      onClickModeButton={action('出退勤の切り替え')}
      onClickStampButton={action('打刻')}
      onChangeMessage={action('メッセージ更新')}
    />
  );
};

_StampWidget.storyName = 'StampWidget';

_StampWidget.parameters = {
  info: { propTables: [StampWidget], inline: true, source: true },
};

export const StampWidget出退勤両方不可 = () => {
  return (
    <StampWidget
      onClickModeButton={action('出退勤の切り替え')}
      onClickStampButton={action('打刻')}
      onChangeMessage={action('メッセージ更新')}
      // @ts-ignore Unused
      isClockInDisabled
      isClockOutDisabled
    />
  );
};

StampWidget出退勤両方不可.storyName = 'StampWidget - 出退勤両方不可';

StampWidget出退勤両方不可.parameters = {
  info: { propTables: [StampWidget], inline: true, source: true },
};
