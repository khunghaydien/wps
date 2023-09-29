import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Input from '../../../components/atoms/Fields/Input';

export default {
  title: 'Components/atoms/Fields/Input',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
    # Description

    input コンポーネント

    # Propsについて

    HTML5 input要素の標準的な属性がpropsとして用意されています。
    詳しくはInputの型定義を参照して下さい。

    # Icon

    \`icon\` prop でアイコンを入力欄の右側に表示することが出来ます。

    ~~~js
    <Input
      icon="adduser"
    />
    ~~~

    # エラー

    \`error\` prop を \`true\` にする事でエラーが発生した時用の見た目になります。

    ~~~js
    <Input
      error
    />
    ~~~
  `)(() => (
  <Input
    testId="unique-id"
    error={boolean('error', null)}
    type={'text'}
    value={text('value', 'Value Value Value Value')}
    placeholder={text('placeholder', 'placeholder placeholder placehoder')}
    icon={'adduser'}
    required={boolean('required', null)}
    onChange={action('onChange')}
    disabled={boolean('disabled', false)}
    readOnly={boolean('readOnly', false)}
  />
));
