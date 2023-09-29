import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import ToggleButton from '../../components/atoms/ToggleButton';

export default {
  title: 'Components/atoms/ToggleButton',
  decorators: [withKnobs],
};

export const Basic = () => (
  <ToggleButton
    label={text('label', 'Label')}
    disabled={boolean('disabled', false)}
    value={boolean('value', true)}
    onClick={action('onClick')}
    testId="unique-id"
  />
);

Basic.parameters = {
  info: `
  # Description

  トグルボタンは値の切り替えが即時に反映されるような場合に使うボタンです。
  例えば、勤怠打刻で「位置情報を取得」の有効を切り替える場合に使われます。
  単に入力フォームでラジオボタンやチェックボックスの代わりとして使うことはできません。
  ラベルまでを含めて、クリッカブルエリアとなります。

  # Toggle State

  \`value\` がtrueの場合にトグルがONになります。
  falseの場合にはOFFになります。

  ~~~js
  <ToggleButton lable="LABEL" value={true} />
  ~~~

  # Handler

  クリックするとonClickイベントハンドラーが発火します。
  第一引数にはToggleButtonの次の状態(on: true, off: false)が渡されます。

  ~~~js
  <ToggleButton lable="LABEL" value={true} onClick={(value) => ...}/>
  ~~~

  # Disabled

  \`disabled\`を\`true\`にすると\`ToggleButton\`が非活性になります。

  ~~~js
  <ToggleButton disabled />
  ~~~

  # E2E テスト

  E2Eテストのために\`testId\` prop に一意なIDを渡してください。
  これにより\`TextButton\`が常に一意に特定できる事をE2Eテストに保障すること出来ます。
`,
};
