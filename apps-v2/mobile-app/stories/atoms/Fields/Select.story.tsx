import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import Select from '../../../components/atoms/Fields/Select';

export default {
  title: 'Components/atoms/Fields/Select',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <Select
    testId="unique-id"
    error={boolean('error', false)}
    value={number('value', 0)}
    multiple={boolean('multiple', false)}
    placeholder={text('placeholder', 'Please select.')}
    size={number('size', 1)}
    options={[
      {
        value: 1,
        label: 'apple',
      },
      {
        value: 2,
        label: 'banana',
      },
    ]}
    icon={false}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    disabled={boolean('disabled', false)}
    onChange={action('onChange')}
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    select コンポーネント

    # Propsについて

    HTML5 select要素の標準的な属性がpropsとして用意されています。
    詳しくはSelectの型定義を参照して下さい。

    # Icon

    アイコンは \`icon={false}\` とすると消えます。
    指定のアイコンを設定することも可能です。

    # エラー

    \`error\` prop を \`true\` にする事でエラーが発生した時用の見た目になります。

    ~~~js
    <Select
      error
    />
    ~~~
      `,
    },
  },
};
