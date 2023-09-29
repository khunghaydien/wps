import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { array, boolean, text, withKnobs } from '@storybook/addon-knobs';

import TextField from '../../../../components/molecules/commons/Fields/TextField';

export default {
  title: 'Components/molecules/commons/Fields/TextField',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <TextField
    testId={text('testId', 'unique-id')}
    icon={'adduser'}
    label={text('label', 'LABEL LABEL LABEL LABEL LABEL LABEL LABEL')}
    placeholder={text('placeholder', 'PLACEHOLDER PLACEHOLDER PLACEHOLDER')}
    required={boolean('required', null)}
    emphasis={boolean('emphasis', null)}
    errors={array('errors', [])}
    value={text('value', null)}
    onChange={action('onChange')}
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    テキスト入力用のコンポーネントです

    # ラベル

    \`label\` props で必ずラベルを指定して下さい。

    ## 必須マーク

    \`required\` propsと併用すると必須マークがラベルにつきます。

    ~~~js
    <TextField
      label="label"
      required
    />
    ~~~

    ## 強調ラベル

    \`emphasis\` を \`true\` にするとラベルの見出しが強調されます。
    \`required\` と併用することもできます。

    ~~~js
    <TextField
      label="label"
      emphasis
    />
    ~~~

    # バリデーションエラー

    バリデーションエラーメッセージをを文字列の配列として渡すことで、ユーザーにエラーの解決を促すことが出来ます。

    ~~~js
    <TextField
      label="label"
      errors={[
        'ERROR MESSAGE #1',
        'ERROR MESSAGE #2',
      ]}
    />
    ~~~

  # Icon

  \`icon\` prop でアイコンを表示することが出来ます。

  ~~~js
  <TextField
    label="label"
    icon="adduser"
  />
  ~~~
      `,
    },
  },
};
