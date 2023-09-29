import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';

import TextArea from '../../../components/atoms/Fields/TextArea';

export default {
  title: 'Components/atoms/Fields/TextArea',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    TextArea コンポーネント

    # Propsについて

    HTML5 input要素の標準的な属性がpropsとして用意されています。
    詳しくはInputの型定義を参照して下さい。

    # エラー

    \`error\` prop を \`true\` にする事でエラーが発生した時用の見た目になります。

    ~~~js
    <TextArea
      error
    />
    ~~~
  `)(() => (
  <TextArea
    testId="unique-id"
    error={boolean('error', null)}
    value={text('value', 'Value Value Value Value')}
    placeholder={text('placeholder', 'placeholder placeholder placehoder')}
    required={boolean('required', false)}
    readOnly={boolean('readOnly', false)}
    onChange={action('onChange')}
    rows={number('rows', 2)}
    disabled={boolean('disabled', false)}
  />
));
