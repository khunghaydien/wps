import React from 'react';

import { action } from '@storybook/addon-actions';

import AttTime3DigitHourField from '../../components/fields/AttTime3DigitHourField';

export default {
  title: 'commons/fields',
};

export const _AttTime3DigitHourField = () => (
  <AttTime3DigitHourField onBlur={action('blurred')} value="110:30" />
);

_AttTime3DigitHourField.storyName = 'AttTime3DigitHourField';

_AttTime3DigitHourField.parameters = {
  info: {
    text: `
  勤怠時刻入力フィールド
  TimeField と以下の点で異なる

    * 選択リストは表示されず、テキスト入力のみ可能
    * 24:00-48:00の時刻も入力可能の時刻も入力可能
  `,
    propTables: [AttTime3DigitHourField],
    inline: true,
    source: true,
  },
};

export const AttTime3DigitHourFieldDisabled = () => (
  <AttTime3DigitHourField onBlur={action('blurred')} value="110:30" disabled />
);

AttTime3DigitHourFieldDisabled.storyName = 'AttTime3DigitHourField (disabled)';

AttTime3DigitHourFieldDisabled.parameters = {
  info: { propTables: [AttTime3DigitHourField], inline: true, source: true },
};
