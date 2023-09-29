import React from 'react';

import { action } from '@storybook/addon-actions';

import AttTimeField from '../../components/fields/AttTimeField';

export default {
  title: 'commons/fields',
};

export const _AttTimeField = () => (
  <AttTimeField onBlur={action('blurred')} value="" />
);

_AttTimeField.storyName = 'AttTimeField';

_AttTimeField.parameters = {
  info: {
    text: `
  勤怠時刻入力フィールド
  TimeField と以下の点で異なる

    * 選択リストは表示されず、テキスト入力のみ可能
    * 24:00-48:00の時刻も入力可能の時刻も入力可能
  `,
    propTables: [AttTimeField],
    inline: true,
    source: true,
  },
};

export const AttTimeFieldDisabled = () => (
  <AttTimeField onBlur={action('blurred')} value="" disabled />
);

AttTimeFieldDisabled.storyName = 'AttTimeField (disabled)';

AttTimeFieldDisabled.parameters = {
  info: { propTables: [AttTimeField], inline: true, source: true },
};
