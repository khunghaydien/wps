import React from 'react';

import { action } from '@storybook/addon-actions';

import AttTimeRangeField from '../../components/fields/AttTimeRangeField';

export default {
  title: 'commons/fields',
};

export const _AttTimeRangeField = () => (
  <AttTimeRangeField
    onBlurAtStart={action('blurred at start')}
    onBlurAtEnd={action('blurred at end')}
    startTime=""
    endTime=""
  />
);

_AttTimeRangeField.storyName = 'AttTimeRangeField';

_AttTimeRangeField.parameters = {
  info: {
    text: `
  勤怠時間帯入力フィールド
  TimeRangeField と以下の点で異なる

  * 選択リストは表示されず、テキスト入力のみ可能
  * 24:00-48:00の時刻も入力可能
  `,
    propTables: [AttTimeRangeField],
    inline: true,
    source: true,
  },
};

export const AttTimeRangeFieldDisabled = () => (
  <AttTimeRangeField
    onBlurAtStart={action('blurred at start')}
    onBlurAtEnd={action('blurred at end')}
    startTime=""
    endTime=""
    disabled
  />
);

AttTimeRangeFieldDisabled.storyName = 'AttTimeRangeField (disabled)';

AttTimeRangeFieldDisabled.parameters = {
  info: { propTables: [AttTimeRangeField], inline: true, source: true },
};
